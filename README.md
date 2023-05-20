# combar
*Universal comment bar on **EVERY** webpage*
* Chrome extension that allows users to select text and create comments in the margins of webpages
* Supplementary hub where users will be recommended personalized content based on their comments and interests

Here is the [combar document](https://docs.google.com/document/d/1kts1oi0CWz9H75kTNUMazHNuUpgKf710yVnz8ZKRJvM/edit?usp=sharing) that outlines future features, use cases, marketing strategies, legal notes, and any brainstorming. 

## Extension
### Framework: [**React**](https://react.dev/)
* Component-based architecture is easy to manage/scale
* Its virtual DOM allows for high performance
* Prior familiarity

## Backend
### Framework: [**Flask**](https://flask.palletsprojects.com/en/2.3.x/)
* Soooo lightweight/simple
* Built with Python
    * Most awesome language ever
    * Richest AI ecosystem (needed for user personalization and any other AI features that are added)
    * Strong web-scraping abilities (may need for advanced features/optimization)

### Database: [**PostgreSQL**](https://www.postgresql.org/)
* Optimized for concurrency
* Offers full-text search
* Meant for large-scale applications

## Setup

1. **Install Git and clone the repository**: If you haven't already, you'll need to install Git on your machine. You can download the installer from the [official Git website](https://git-scm.com/downloads). Once Git is installed, you can clone the repository by running the following command in your terminal, replacing `your-username` with your actual GitHub username:

   ```powershell
   git clone https://github.com/your-username/Comment-Bar.git

### Extension

1. **Ensure Node.js and npm are installed**: You can verify your Node.js and npm installation by running the following command in your command prompt or terminal:

    ```powershell
    node --version
    npm --version
    ```

   If you do not have Node.js or npm installed, you can download the installer from the [official Node.js website](https://nodejs.org/).

2. **Set up the environment for an existing Chrome extension**: Navigate to the directory where your existing Chrome extension is located, then run the following command in your terminal:

   ```powershell
   npm install
   ```
This will install all the necessary dependencies for your extension.

3. **Build the extension**: To build the extension, open the terminal in Visual Studio Code and run the following command:

   ```powershell
   npm run build
   ```

This will create a `dist` directory containing the built extension.

4. **Load the extension**: To load the extension, open Google Chrome and navigate to `chrome://extensions/`. Enable Developer mode by toggling the switch in the top right corner. Click on the "Load unpacked" button, then select the `dist` directory that was created in step 3.

### Backend

1. **Ensure Python is installed**: Python 3.6 or higher is required. You can verify your Python installation by running the following command in your command prompt (Windows) or terminal (Mac/Linux):

    ```powershell
    python --version
    ```

2. **Set up a virtual environment**: Navigate to the backend directory, then create a virtual environment using Python's `venv` module with the following command:

    ```powershell
    python -m venv venv
    ```

3. **Activate the virtual environment**: In Windows Powershell, you can activate the virtual environment using the following command:

    ```powershell
    .\venv\Scripts\activate
    ```

4. **Install the required packages**: Run the following command to install the dependencies needed for the project:

    ```powershell
    pip install -r requirements.txt
    ```

5. **Set the environment variables**: In Powershell, use the following commands to set the necessary Flask environment variables:

    ```powershell
    $env:FLASK_APP="app"
    $env:FLASK_ENV="development"
    ```

6. **Run the Flask application**: Use the following command to start the Flask development server. You should now be able to access your Flask application at `http://localhost:5000`.

    ```powershell
    flask run
    ```

Remember to replace `"app"` with the actual name or path of your Flask application file if it's not named `app.py`.

### Database

1. **Download and Install PostgreSQL**: Visit the official PostgreSQL website and download the installer based on your operating system. This will also include pgAdmin, a graphical user interface for managing PostgreSQL databases.

2. **Setup PostgreSQL**: Launch the PostgreSQL installer. During the setup process, you will be asked to provide a password for the PostgreSQL superuser (`postgres`). Please remember this password as it will be used to connect to the PostgreSQL server.

3. **Launch pgAdmin**: After installation, open pgAdmin. The first time you launch it, you will be asked to enter the password you created during the PostgreSQL installation.

4. **Create a New Database**: In pgAdmin, right-click on `Databases` under the server tree and click `Create` > `Database...`. Provide a name for your database, then click `Save`.

5. **Specify URI of local database**: In the backend folder create a file named `.env` and the following:

    ```env
    export DATABASE_URL="postgresql://postgres:your_password@localhost/your_database"
    ```

Replace `'your_password'` with the PostgreSQL superuser password you created during the PostgreSQL installation, and `'your_database'` with the name of the database you created in pgAdmin.

6. **Initialize your Database**: Now that your Flask application is configured to use PostgreSQL, you can initialize your database using the SQLAlchemy ORM included in Flask. In your terminal or command prompt, while in your virtual environment, run the following command:

    ```powershell
    flask db init
    flask db migrate
    flask db upgrade
    ```

This will create the necessary tables and relationships in your PostgreSQL database based on the models defined in your Flask application.

7. **Run the Flask Application**: You can now start your Flask application with the following command:

    ```powershell
    flask run
    ```

You should now be able to interact with your Flask application and PostgreSQL database. Remember, any changes to your Flask application's models will