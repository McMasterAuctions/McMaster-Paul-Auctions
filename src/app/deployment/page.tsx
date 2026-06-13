import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deployment Guide - McMaster & Paul Auctions',
}

export default function DeploymentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Deployment Guide</h1>
        <p className="text-gray-600 text-lg">
          Instructions for deploying McMaster & Paul Auctions to production
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Node.js 18+ installed locally</li>
            <li>PostgreSQL database (Vercel Postgres recommended)</li>
            <li>AWS S3 bucket for image storage</li>
            <li>GitHub account with repository access</li>
            <li>Vercel account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Step 1: Set Up Database</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <p>Create a PostgreSQL database and get the connection string:</p>
            <code className="block bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              DATABASE_URL="postgresql://user:password@host:5432/dbname"
            </code>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Step 2: Configure Environment Variables</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <p>Set up the following environment variables in Vercel:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
              <li>DATABASE_URL - PostgreSQL connection string</li>
              <li>NEXTAUTH_SECRET - Generate with: openssl rand -base64 32</li>
              <li>NEXTAUTH_URL - Your production domain</li>
              <li>AWS_ACCESS_KEY_ID - AWS credentials</li>
              <li>AWS_SECRET_ACCESS_KEY - AWS credentials</li>
              <li>AWS_S3_BUCKET - S3 bucket name</li>
              <li>AWS_S3_REGION - AWS region</li>
              <li>NEXT_PUBLIC_API_URL - Your production API URL</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Step 3: Deploy to Vercel</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Go to <a href="https://vercel.com" className="text-blue-600 hover:underline">vercel.com</a></li>
              <li>Click "New Project"</li>
              <li>Select your GitHub repository</li>
              <li>Add environment variables</li>
              <li>Click "Deploy"</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Step 4: Run Database Migrations</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <p>After deployment, run migrations:</p>
            <code className="block bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              vercel env pull .env.local
              npm run db:push
            </code>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Performance Optimization</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Enable Image Optimization in Vercel</li>
            <li>Use Vercel Analytics for monitoring</li>
            <li>Configure CDN for static assets</li>
            <li>Enable Gzip compression</li>
            <li>Use database connection pooling</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Security Checklist</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✓ HTTPS enabled automatically on Vercel</li>
            <li>✓ Environment variables secured</li>
            <li>✓ Database credentials encrypted</li>
            <li>✓ API routes protected with authentication</li>
            <li>✓ CORS configured properly</li>
            <li>✓ Rate limiting implemented</li>
            <li>✓ SQL injection prevention with Prisma</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
