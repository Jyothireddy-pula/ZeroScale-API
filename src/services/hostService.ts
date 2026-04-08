import { FilterQuery } from "mongoose";
import { Host, IHost } from "../models/Host";
import { HostCreateInput, HostQueryInput, HostUpdateInput } from "../validators/hostValidator";
import { getCache, setCache, deleteCache, invalidatePattern } from "../utils/cache";

export const createHost = async (payload: HostCreateInput): Promise<IHost> => {
  const host = new Host(payload);
  const result = await host.save();
  
  // Invalidate cache when new host is created
  await invalidatePattern('hosts:*');
  
  return result;
};

export const getHosts = async (
  query: HostQueryInput,
): Promise<{ data: IHost[]; total: number; page: number; limit: number }> => {
  const { page, limit, sortByRating, sortBy, state, rating, search, minRating, maxRating } = query;
  
  // Create cache key
  const cacheKey = `hosts:${page}:${limit}:${sortByRating || 'none'}:${sortBy || 'none'}:${state || 'all'}:${rating || 'all'}:${search || 'none'}:${minRating || 'all'}:${maxRating || 'all'}`;
  
  // Try to get from cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const filter: FilterQuery<IHost> = {};

  if (state) {
    filter.state = state;
  }

  if (rating) {
    filter.rating = rating;
  }

  if (minRating !== undefined || maxRating !== undefined) {
    filter.rating = {};
    if (minRating !== undefined) {
      filter.rating.$gte = minRating;
    }
    if (maxRating !== undefined) {
      filter.rating.$lte = maxRating;
    }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { state: { $regex: search, $options: 'i' } }
    ];
  }

  const sort: Record<string, 1 | -1> = {};
  if (sortByRating) {
    sort.rating = sortByRating === "asc" ? 1 : -1;
  } else if (sortBy) {
    sort[sortBy] = sortBy === "name" ? 1 : -1;
    if (sortBy === "rating") {
      sort[sortBy] = -1; // Default to descending for rating
    }
  } else {
    sort.createdAt = -1; // Default sort by newest first
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Host.find(filter).sort(sort).skip(skip).limit(limit),
    Host.countDocuments(filter),
  ]);

  const result = { data, total, page, limit };
  
  // Cache the result for 5 minutes
  await setCache(cacheKey, JSON.stringify(result), 300);
  
  return result;
};

export const getHostById = async (id: string): Promise<IHost | null> => {
  const cacheKey = `host:${id}`;
  
  // Try to get from cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const host = await Host.findById(id);
  
  // Cache the result for 10 minutes
  if (host) {
    await setCache(cacheKey, JSON.stringify(host), 600);
  }
  
  return host;
};

export const updateHost = async (id: string, payload: HostUpdateInput): Promise<IHost | null> => {
  const host = await Host.findByIdAndUpdate(id, payload, { new: true });
  
  if (host) {
    // Invalidate all host-related caches
    await invalidatePattern('hosts:*');
    await deleteCache(`host:${id}`);
  }
  
  return host;
};

export const deleteHost = async (id: string): Promise<IHost | null> => {
  const host = await Host.findByIdAndDelete(id);
  
  if (host) {
    // Invalidate all host-related caches
    await invalidatePattern('hosts:*');
    await deleteCache(`host:${id}`);
  }
  
  return host;
};

