# TiberiFamiliar

Welcome to TiberiFamiliar! This project is a recipe-sharing application designed to help people share their favorite recipes with family and friends. It includes unique usability features, such as adjusting ingredient quantities based on the number of people you want to cook for.

## Live Demo

You can access the live demo of the project [here](https://tiberifamiliar.com/).

## Overview

TiberiFamiliar is built using Next.js 14 and leverages server actions for its backend functionalities. It employs a PostgreSQL database managed through Prisma ORM and utilizes Auth.js for secure authentication. The entire application is written in TypeScript to ensure type safety and code reliability.

## Features

- **Recipe Sharing**: Share recipes easily with family and friends.
- **Dynamic Ingredient Adjustment**: Automatically update ingredient quantities based on the number of servings.
- **Next.js 14**: Utilizes the latest version of Next.js with server actions for seamless server-side functionality.
- **PostgreSQL & Prisma ORM**: Robust data management using PostgreSQL and Prisma ORM.
- **Auth.js**: Secure user authentication.
- **TypeScript**: Entirely written in TypeScript for enhanced type safety and maintainability.

## Getting Started

To get a local copy of the project up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or above)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/encinascarles/tiberifamiliar.git
    ```
2. Navigate to the project directory:
    ```sh
    cd tiberifamiliar
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

### Setting Up PostgreSQL

Ensure you have a PostgreSQL instance running. Update the PostgreSQL connection string in your environment variables.

Create a `.env` file in the project root and add your PostgreSQL connection string:
```sh
DATABASE_URL=your_postgresql_connection_string
```

### Setting Up Authentication

Configure Auth.js by adding the necessary environment variables to your `.env` file:
```sh
NEXTAUTH_URL=your_nextauth_url
NEXTAUTH_SECRET=your_nextauth_secret
```

### Running Database Migrations

To set up the database schema, run:
```sh
npx prisma migrate dev
```

### Running the Application

To start the development server, run:
```sh
npm run dev
```
or
```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Learnings

This project was primarily built as a learning exercise. Here are some of the key areas I focused on:

- **Next.js 14**: Utilizing the latest features of Next.js, including server actions for backend functionality.
- **PostgreSQL & Prisma ORM**: Managing data efficiently with PostgreSQL and Prisma ORM.
- **Authentication**: Implementing secure user authentication with Auth.js.
- **TypeScript**: Ensuring type safety and code reliability by writing the entire project in TypeScript.
- **Usability Features**: Implementing dynamic features to enhance user experience, such as ingredient quantity adjustment.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.
