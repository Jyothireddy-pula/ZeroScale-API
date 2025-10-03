# ZeroScale-API
Overview 🔍

( ZeroScale-API ) - Scalable & Cost-Optimized Serverless Backend

ZeroScale-API is a scalable, serverless backend solution designed for efficiently managing profiles and reviews. Built using the Serverless Framework and deployed on AWS Lambda, it eliminates infrastructure management while ensuring cost-effective scaling and high availability.



💰 Cost Efficiency & Scalability


The API scales down to approximately zero cost for up to 1 million API requests per month.

If there is no traffic, the infrastructure automatically scales down to near-zero cost, inclusive of AWS services like S3, API Gateway, and other dependencies.

When traffic increases, it seamlessly scales up using the AWS API Gateway to handle the load.

After exceeding 1 million requests, costs are incurred based on AWS Lambda pricing.

🚀 Fully Automated & Cost-Optimized CI/CD Deployment

Run Code Quality Checks – ESLint for linting and Jest for API endpoint testing.

Automated CI/CD Based Testing & Deployment Optimization

Installs the testing dependencies, runs tests, and removes them post-testing to reduce package size.

Prunes old versions from the cloud and reduces dev dependencies before packaging.

Deploy to AWS – Automatically updates the AWS Lambda function and connects with API Gateway.

Verify and Activate Lambda – Ensures the function is running seamlessly after deployment.

✨ Features

Fetch reviews, post reviews, and find people (hosts) based on various parameters like state or ID.

Fully serverless with AWS Lambda ⚡

Uses MongoDB Atlas as the database 🌴

CI/CD automation with GitHub Actions 🤖

TypeScript for type safety 💎

Linting Test

Jest for API endpoint testing ✅

Rate limiting to prevent abuse ⚖️

Logging and monitoring with AWS CloudWatch 📊

🛠️ Tech Stack

Node.js (Runtime: 18.x) 💚

TypeScript (Type-Safe Development) 💎

MongoDB Atlas (Database) 🌴

AWS Lambda (Serverless Compute) ⚡

AWS API Gateway

Serverless Framework

🔐 Security Features

✅ Rate Limiting – Prevents abuse and DDoS attacks, ensuring API stability.

✅ Code Quality Enforcement – Integrates ESLint into CI/CD to maintain high-quality code.

✅ Secure Key Management – Uses GitHub Secrets Manager to protect API keys and environment variables.

✅ Database Security – MongoDB Atlas is secured with IP whitelisting, restricting unauthorized access.

🔧 Setup Instructions

1️⃣ Clone the Repository 🔗

git clone https://github.com/Jyothireddy-pula/ZeroScale-API.git

2️⃣ Install Dependencies 📦

npm install

3️⃣ Environment Variables 🔑

MONGO_URI=your-mongodb-connection-string

4️⃣ Run Locally with Serverless Offline 🖥️

npx serverless offline

5️⃣ Deploy to AWS Lambda 🚀

npx serverless deploy


👨‍💻Creator and Maintainer.

Jyothi Reddy.Pula

🔗 Connect on LinkedIn
[🔗 Connect on LinkedIn](https://www.linkedin.com/in/jyothireddy-pula-5b3a01337/)


📧 Email:jyothireddypula@gmail.com
