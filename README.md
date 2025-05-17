WasteWise: Next.js Waste Management Platform

 A Next.js platform for managing waste collection, transportation, and recycling with Clerk authentication, Azure SQL, and Prisma ORM.



  Features ·
  Demo ·
  Deploy to Vercel ·
  Clone and Run Locally ·
  Feedback and Issues



Features

Built with Next.js App Router
Server Components, Client Components, Route Handlers, and Server Actions
Middleware for authentication with Clerk


Authentication via Clerk
Seamless user management and session handling


Database management with Azure SQL and Prisma ORM
Schema migrations and type-safe queries


Styling with Tailwind CSS
UI components with shadcn/ui
Onboarding for roles (e.g., Generator, Transporter, Recycler)
M-Pesa integration for payments
File uploads for license and vehicle compliance

Demo
A fully working demo is coming soon. Check back for updates!
Deploy to Vercel
You can deploy this project to Vercel with the following steps:

Clone the Repository:Clone this repository to your GitHub account or fork it.

Deploy with Vercel:Click the button below to deploy directly to Vercel. You’ll be prompted to configure environment variables during deployment.


Set Environment Variables:During deployment, add the following environment variables in Vercel’s dashboard (see Clone and Run Locally for details):

CLERK_SECRET_KEY
CLERK_PUBLISHABLE_KEY
DATABASE_URL (Azure SQL connection string)
NEXT_PUBLIC_Mpesa_CONSUMER_KEY (if using M-Pesa)
NEXT_PUBLIC_Mpesa_CONSUMER_SECRET (if using M-Pesa)


Complete Deployment:Vercel will build and deploy the app. Once deployed, your app will be accessible at https://your-project-name.vercel.app.


Clone and Run Locally
Follow these steps to set up and run the project locally:

Prerequisites:

Node.js (v18 or higher)
pnpm (recommended, or use npm/yarn)
A Clerk account for authentication
An Azure SQL database
(Optional) M-Pesa credentials for payment integration


Clone the Repository:
git clone https://github.com/your-username/wastewise.git
cd wastewise


Install Dependencies:
pnpm install

Or use npm/yarn:
npm install


Set Up Environment Variables:Copy .env.example to .env.local and update the following:
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
DATABASE_URL=your_azure_sql_connection_string
NEXT_PUBLIC_Mpesa_CONSUMER_KEY=your_mpesa_consumer_key
NEXT_PUBLIC_Mpesa_CONSUMER_SECRET=your_mpesa_consumer_secret


Clerk Keys: Find these in your Clerk Dashboard under API Keys.
Azure SQL Connection String: Get this from your Azure Portal under your SQL database’s connection settings. Example:Server=tcp:your-server.database.windows.net,1433;Initial Catalog=your-database;Persist Security Info=False;User ID=your-username;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;


M-Pesa Keys: Obtain from the Safaricom Developer Portal if using M-Pesa.


Set Up Prisma:

Update prisma/schema.prisma with your models (e.g., User, Generator, MpesaTransaction).
Run migrations to set up the Azure SQL database:npx prisma migrate dev --name init




Run the Development Server:
pnpm dev

Or:
npm run dev

The app should now be running at http://localhost:3000.

Customize shadcn/ui (Optional):If you want to change the default shadcn/ui styles, delete components.json and re-initialize:
npx shadcn-ui@latest init

Follow the prompts to select your preferred styles.


Feedback and Issues
Please file feedback and issues on the project’s GitHub Issues page.
Project Structure

app/: Next.js App Router routes and pages (e.g., onboarding, dashboard)
components/: Reusable UI components (e.g., NewHouseModal, MultiStepForm)
lib/: Utilities and server-side logic
prisma.ts: Prisma client setup
onboarding.ts: Server actions for onboarding
generators.ts: Server actions for house/generator management


prisma/: Prisma schema and migrations
public/uploads/: Local storage for file uploads (e.g., licenses, vehicle photos)

Contributing
Contributions are welcome! Please open a pull request or issue on GitHub.
License
This project is licensed under the MIT License.
