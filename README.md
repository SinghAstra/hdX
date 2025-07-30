# hdX - Your Personal Note-Taking Web App

## Project Overview

hdX is a modern, feature-rich note-taking application designed for developers and anyone who needs a simple, elegant way to capture and organize their thoughts. It solves the problem of scattered notes across various platforms by providing a centralized, easily accessible, and visually appealing space for all your ideas.

**Why hdX?**

- **Centralized Knowledge:** Keep all your notes in one place, accessible from anywhere.
- **Developer-Friendly:** Built with a modern tech stack, making it easy to extend and customize.
- **Visually Appealing:** Enjoy a clean and intuitive user interface with subtle animations and theme options.
- **Secure Authentication:** Uses OTP and NextAuth for secure and seamless login.

**Target Audience:**

- Developers
- Students
- Writers
- Anyone who needs a simple and effective note-taking solution

**What makes hdX unique?**

hdX combines a clean, intuitive user interface with a robust backend, offering a delightful note-taking experience. The use of Framer Motion for subtle animations and Next.js Themes for personalized aesthetics sets it apart from other note-taking apps. The focus on developer experience, with a well-structured codebase and clear contribution guidelines, makes it easy to extend and customize.

## Key Features

- **Note Creation & Management:**
  - Create, edit, and delete notes with a simple and intuitive interface.
  - Form validation using Yup for robust data handling.
- **User Authentication:**
  - Secure sign-in and sign-up using OTP (One-Time Password) sent to your email.
  - Integration with NextAuth for authentication management.
- **Theming:**
  - Switch between light and dark themes with a smooth transition using Next.js Themes and Framer Motion.
- **Visually Appealing UI:**
  - Subtle animations using Framer Motion to enhance user experience.
  - Customizable UI components built with `shadcn/ui`.
  - Animated backgrounds and borders using CSS gradients.
- **Responsive Design:**
  - The application is designed to work seamlessly on various screen sizes.
- **Data Persistence:**
  - Uses Prisma ORM with a PostgreSQL database for reliable data storage.

## Architecture & Code Organization

hdX follows a modern web application architecture, leveraging the power of Next.js for server-side rendering, routing, and API endpoints.

- **Frontend (React Components):** The user interface is built using React components, organized into functional units.
- **Backend (API Routes):** API endpoints are defined using Next.js API routes, handling authentication, note creation, and data retrieval.
- **Data Layer (Prisma):** Prisma ORM is used to interact with the PostgreSQL database, providing a type-safe and efficient way to manage data.
- **Authentication (NextAuth):** NextAuth.js handles user authentication, session management, and integration with authentication providers.

**Component Interaction:**

1.  The user interacts with React components in the `app/` and `components/` directories.
2.  Components trigger API calls to Next.js API routes in the `app/api/` directory.
3.  API routes use Prisma to interact with the PostgreSQL database.
4.  NextAuth handles authentication and session management.

## Technology Stack

- **Next.js:** A React framework for building server-rendered and statically generated web applications. Chosen for its performance, developer experience, and rich feature set.
- **TypeScript:** A superset of JavaScript that adds static typing, improving code maintainability and reducing errors.
- **Prisma:** A modern ORM for Node.js and TypeScript, providing a type-safe and efficient way to interact with databases.
- **PostgreSQL:** A powerful and reliable open-source relational database.
- **NextAuth.js:** An authentication library for Next.js, simplifying the implementation of authentication flows.
- **Tailwind CSS:** A utility-first CSS framework for rapidly styling web applications.
- **Framer Motion:** A motion library for React, used to create smooth and engaging animations.
- **Yup:** A JavaScript schema builder for value parsing and validation.
- **shadcn/ui:** A collection of accessible and reusable UI components, built with Radix UI and Tailwind CSS.
- **Nodemailer:** A module for Node.js applications to allow easy email sending.
- **SWR:** React Hooks library for remote data fetching.

## Getting Started

Follow these steps to get hdX up and running on your local machine:

**Prerequisites:**

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

**Installation:**

1.  Clone the repository:

    ```bash
    git clone https://github.com/SinghAstra/hdx
    cd hdX
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up your PostgreSQL database:

    - Create a new database.
    - Update the `DATABASE_URL` environment variable in your `.env` file with your database connection string.

4.  Run Prisma migrations:

    ```bash
    npx prisma migrate dev
    ```

5.  Start the development server:

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

**Common Development Commands:**

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npx prisma migrate dev`: Apply Prisma migrations to your database.
- `npx prisma studio`: Open Prisma Studio to visually inspect your database.

## Project Structure

```
hdX/
├── app/                      # Next.js app directory (pages, API routes)
│   ├── (home)/               # Routes for the home page
│   │   ├── page.tsx          # Home page component
│   │   ├── layout.tsx        # Home page layout
│   │   └── hero.tsx          # Hero section component
│   ├── (auth)/               # Authentication routes
│   │   ├── sign-in/          # Sign-in page
│   │   │   ├── page.tsx      # Sign-in page component
│   │   │   └── sign-in-client-page.tsx # Client-side sign-in logic
│   │   └── sign-up/          # Sign-up page
│   │       ├── page.tsx      # Sign-up page component
│   │       └── sign-up-client-page.tsx # Client-side sign-up logic
│   ├── dashboard/            # Dashboard routes
│   │   ├── page.tsx          # Dashboard page component
│   │   └── layout.tsx        # Dashboard layout
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication API routes
│   │   │   ├── [...nextauth]/ # NextAuth route
│   │   │   ├── send-otp/     # Send OTP API route
│   │   │   ├── sign-in-with-otp/ # Sign-in with OTP API route
│   │   │   └── verify-otp/   # Verify OTP API route
│   │   └── notes/            # Notes API routes
│   │       ├── route.ts      # API route for all notes
│   │       └── [id]/         # API route for a specific note
│   │           └── route.ts  # API route for a specific note
│   └── globals.css           # Global CSS styles
│   └── layout.tsx            # Root layout component
├── components/             # React components
│   ├── home/                # Components for the home page
│   │   ├── footer.tsx        # Footer component
│   │   ├── navbar.tsx        # Navbar component
│   │   └── theme-toggle.tsx  # Theme toggle component
│   ├── dashboard/           # Components for the dashboard
│   │   ├── create-new-note-dialog.tsx # Dialog for creating new notes
│   │   ├── create-new-note.tsx # Form for creating new notes
│   │   ├── empty-notes-sidebar-repo-list.tsx # Placeholder UI for empty notes list
│   │   ├── left-sidebar-repo-list.tsx # List of note cards in the sidebar
│   │   ├── left-sidebar.tsx  # Left sidebar component
│   │   ├── navbar.tsx        # Dashboard navbar component
│   │   ├── note-card.tsx     # Note card component
│   │   └── right-sidebar.tsx # Right sidebar component
│   ├── component-x/        # Collection of cool components
│   │   ├── moving-background.tsx # Animated background component
│   │   ├── moving-border.tsx # Animated border component
│   │   ├── border-hover-link.tsx # Link with border hover effect
│   │   ├── conic-background.tsx # Conic gradient background component
│   │   ├── masked-grid-background.tsx # Masked grid background component
│   │   └── radial-background.tsx # Radial gradient background component
│   ├── providers/           # Providers for theme, toast, etc.
│   │   ├── provider.tsx      # Provider component
│   │   ├── theme.tsx         # Theme provider
│   │   └── toast.tsx         # Toast provider
│   └── ui/                  # Reusable UI components (shadcn/ui)
│       ├── avatar-menu.tsx   # Avatar menu component
│       ├── avatar.tsx        # Avatar component
│       ├── button.tsx        # Button component
│       ├── calendar.tsx      # Calendar component
│       ├── checkbox.tsx      # Checkbox component
│       ├── date-picker.tsx   # Date picker component
│       ├── dialog.tsx        # Dialog component
│       ├── dropdown-menu.tsx # Dropdown menu component
│       ├── input.tsx         # Input component
│       ├── label.tsx         # Label component
│       ├── popover.tsx       # Popover component
│       ├── separator.tsx     # Separator component
│       ├── sonner.tsx        # Sonner component
│       └── textarea.tsx      # Textarea component
├── lib/                      # Utility functions and configurations
│   ├── api.ts              # API endpoint constants
│   ├── auth-options.ts     # NextAuth options
│   ├── email.ts            # Email sending configuration
│   ├── interfaces/         # TypeScript interfaces
│   │   ├── auth.ts         # Authentication interfaces
│   │   ├── note.ts         # Note interface
│   │   └── site.ts         # Site configuration interface
│   ├── prisma.ts           # Prisma client initialization
│   ├── utils.ts            # Utility functions
│   ├── validations/       # Validation schemas
│   │   ├── auth.ts         # Authentication validation schema
│   │   └── note.ts         # Note validation schema
│   └── variants.ts         # Framer Motion animation variants
├── prisma/                   # Prisma schema and migrations
│   ├── schema.prisma       # Prisma schema definition
│   └── migrations/         # Prisma migrations
├── config/                   # Configuration files
│   └── site.ts             # Site configuration
├── interfaces/               # TypeScript interfaces
├── public/                   # Public assets
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore file
├── components.json         # UI component library configuration
├── package-lock.json       # Dependency lock file
├── package.json            # Project metadata and dependencies
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project README
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

**Key Files to Explore:**

- `app/dashboard/page.tsx`: The main dashboard component.
- `components/dashboard/note-card.tsx`: The component for rendering individual notes.
- `app/api/notes/route.ts`: The API endpoint for fetching and creating notes.
- `prisma/schema.prisma`: The Prisma schema defining the data models.
- `lib/auth-options.ts`: The NextAuth configuration.

We hope you enjoy contributing to hdX!
