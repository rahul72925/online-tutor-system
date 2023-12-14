# Online Tutor System Setup Guide

Follow these steps to configure the repository on your local system:

1. **Clone the Repository:**

   - Clone this repository to your local machine.

2. **Install Dependencies:**

   - Open a terminal in the root directory.
   - Run the command `yarn` to install all the necessary dependencies.

3. **Create Environment Variables:**

   - Duplicate the `.env.example` template file in the root directory.
   - Rename the duplicated file to `.env`.
   - Edit the `.env` file and set the following variables:
     ```env
     PORT=4012
     JWT_SECRET_FOR_AUTH=anything
     ```

4. **Configure Database with PostgreSQL:**

   - Ensure you have PostgreSQL installed and running.
   - Create a new database or use an existing one.
   - Generate the PostgreSQL connection URL in the format:
     ```plaintext
     "postgresql://<username>:<password>@<host>:5432/<db-name>"
     ```
   - Update the `.env` file with the generated connection URL with `POSTGRES_DATA_BASE_URL` variable.

5. **Create Database Schema:**

   - Open the `db.sql` file and copy its contents.
   - Run the copied SQL script in your preferred database query tool to create the necessary schema.

6. **Start the Server:**
   - In the terminal, run the command `yarn start` in the root directory to start the server.

You have now successfully set up the Online Tutor System on your local machine. Ensure that all steps are completed accurately for a smooth experience.
