import { FilterQuery } from "mongoose";
import { Host, IHost } from "../models/Host";
import { HostCreateInput, HostQueryInput, HostUpdateInput } from "../validators/hostValidator";

export const createHost = async (payload: HostCreateInput): Promise<IHost> => {
  const host = new Host(payload);
  return host.save();
};

export const getHosts = async (
  query: HostQueryInput,
): Promise<{ data: IHost[]; total: number; page: number; limit: number }> => {
  const { page, limit, sortByRating, state } = query;
  const filter: FilterQuery<IHost> = {};

  if (state) {
    filter.state = state;
  }

  const sort: Record<string, 1 | -1> = {};
  if (sortByRating) {
    sort.rating = sortByRating === "asc" ? 1 : -1;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Host.find(filter).sort(sort).skip(skip).limit(limit),
    Host.countDocuments(filter),
  ]);

  return { data, total, page, limit };
};

export const getHostById = async (id: string): Promise<IHost | null> => {
  return Host.findById(id);
};

export const updateHost = async (id: string, payload: HostUpdateInput): Promise<IHost | null> => {
  return Host.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteHost = async (id: string): Promise<IHost | null> => {
  return Host.findByIdAndDelete(id);
};

