<h1>combar</h1>
<p><em>Universal comment bar on <strong>EVERY</strong> webpage</em></p>
<ul>
  <li>Chrome extension that allows users to select text and create comments in the margins of webpages</li>
  <li>Supplementary hub where users will be recommended personalized content based on their comments and interests</li>
</ul>
<p>Here is the <a href="https://docs.google.com/document/d/1kts1oi0CWz9H75kTNUMazHNuUpgKf710yVnz8ZKRJvM/edit?usp=sharing" target="_blank">combar document</a> that outlines future features, use cases, marketing strategies, legal notes, and any brainstorming.</p>

<h2>Extension</h2>
<h3>Framework: <a href="https://react.dev/" target="_blank"><strong>React</strong></a></h3>
<ul>
  <li>Component-based architecture is easy to manage/scale</li>
  <li>Its virtual DOM allows for high performance</li>
  <li>Prior familiarity</li>
</ul>

<h2>Backend</h2>
<h3>Framework: <a href="https://flask.palletsprojects.com/en/2.3.x/" target="_blank"><strong>Flask</strong></a></h3>
<ul>
  <li>Soooo lightweight/simple</li>
  <li>Built with Python
    <ul>
      <li>Most awesome language ever</li>
      <li>Richest AI ecosystem (needed for user personalization and any other AI features that are added)</li>
      <li>Strong web-scraping abilities (may need for advanced features/optimization)</li>
    </ul>
  </li>
</ul>

<h3>Database: <a href="https://www.postgresql.org/" target="_blank"><strong>PostgreSQL</strong></a></h3>
<ul>
  <li>Optimized for concurrency</li>
  <li>Offers full-text search</li>
  <li>Meant for large-scale applications</li>
</ul>

<h2>Setup</h2>
<ol>
  <li><strong>Install VSCode from the <a href="https://code.visualstudio.com/Download" target="_blank">download page</a></strong></li>
  <li><strong>Install Git and clone the repository</strong>: If you haven't already, you'll need to install Git on your machine. You can download the installer from the <a href="https://git-scm.com/downloads" target="_blank">official Git website</a>. Once Git is installed, you can clone the repository by running <code>git clone</code> followed by the https link to the repo in the <code>&lt;&gt; Code</code> dropdown above.</li>
</ol>

<h3>Extension</h3>
<ol>
  <li><strong>Ensure Node.js and npm are installed</strong>: You can verify your Node.js and npm installation by running the following command in your command prompt or terminal:
    <pre><code>
    node --version
    npm --version
    </code></pre>
    If you do not have Node.js or npm installed, you can download the installer from the <a href="https://nodejs.org/" target="_blank">official Node.js website</a>.
  </li>
  <li><strong>Set up the environment for an existing Chrome extension</strong>: Navigate to the directory where your existing Chrome extension is located, then run the following command in your terminal:
    <pre><code>
    npm install
    </code></pre>
    This will install all the necessary dependencies for your extension.
  </li>
  <li><strong>Build the extension</strong>: To build the extension, open the terminal in Visual Studio Code and run the following command:
    <pre><code>
    npm run build
    </code></pre>
    This will create a <code>dist</code> directory containing the built extension.
  </li>
  <li><strong>Load the extension</strong>: To load the extension, open Google Chrome and navigate to <code>chrome://extensions/</code>. Enable Developer mode by toggling the switch in the top right corner. Click on the "Load unpacked" button, then select the <code>dist</code> directory that was created in step 3.
  </li>
</ol>

<h3>Backend</h3>
<ol>
  <li><strong>Ensure Python is installed</strong>: Python 3.6 or higher is required. You can verify your Python installation by running the following command in your command prompt (Windows) or terminal (Mac/Linux):
    <pre><code>
    python --version
    </code></pre>
  </li>
  <li><strong>Set up a virtual environment</strong>: Navigate to the backend directory, then create a virtual environment using Python's <code>venv</code> module with the following command:
    <pre><code>
    python -m venv venv
    </code></pre>
  </li>
  <li><strong>Activate the virtual environment</strong>: In Windows Powershell, you can activate the virtual environment using the following command:
    <pre><code>
    .\venv\Scripts\activate
    </code></pre>
  </li>
  <li><strong>Install the required packages</strong>: Run the following command to install the dependencies needed for the project:
    <pre><code>
    pip install -r requirements.txt
    </code></pre>
  </li>
  <li><strong>Set the environment variables</strong>: In Powershell, use the following commands to set the necessary Flask environment variables:
    <pre><code>
    $env:FLASK_APP="app"
    $env:FLASK_ENV="development"
    </code></pre>
  </li>
</ol>

<h3>Database</h3>
<ol>
  <li><strong>Download and Install PostgreSQL</strong>: Visit the <a href="https://www.postgresql.org/download/" target="_blank">official PostgreSQL website</a> and download the installer based on your operating system. This will also include pgAdmin, a graphical user interface for managing PostgreSQL databases.</li>
  <li><strong>Setup PostgreSQL</strong>: Launch the PostgreSQL installer. During the setup process, you will be asked to provide a password for the PostgreSQL superuser (<code>postgres</code>). Please remember this password as it will be used to connect to the PostgreSQL server.</li>
  <li><strong>Launch pgAdmin</strong>: After installation, open pgAdmin. The first time you launch it, you will be asked to enter the password you created during the PostgreSQL installation.</li>
  <li><strong>Register a New Server</strong>: In pgAdmin, right-click on <code>Databases</code> under the server tree and click <code>Register</code> > <code>Server...</code>. Provide a name for your server. Then, navigate to the <code>Connection</code> tab and input <code>localhost</code> for the Host name and input your <code>Password</code>.</li>
  <li><strong>Create a New Database</strong>: In pgAdmin, right-click on <code>Databases</code> under the server tree and click <code>Create</code> > <code>Database...</code>. Provide a name for your database, then click <code>Save</code>.</li>
  <li><strong>Specify URI of local database</strong>: In the backend folder, create a file named <code>.env</code>, then add the following line:
    <pre><code>
    export DATABASE_URL="postgresql://postgres:your_password@localhost/your_database"
    </code></pre>
    Replace <code>'your_password'</code> with the PostgreSQL superuser password you created during the PostgreSQL installation, and <code>'your_database'</code> with the name of the database you created in pgAdmin.
  </li>
  <li><strong>Initialize your Database</strong>: Now that your Flask application is configured to use PostgreSQL, you can initialize your database using the SQLAlchemy ORM included in Flask. In your terminal or command prompt, while in your virtual environment, run the following command:
    <pre><code>
    flask db init
    flask db migrate
    flask db upgrade
    </code></pre>
    This will create the necessary tables and relationships in your PostgreSQL database based on the models defined in your Flask application.
  </li>
  <li><strong>Run the Flask Application</strong>: You can now start your Flask application with the following command:
    <pre><code>
    flask run
    </code></pre>
    You should now be able to interact with your Flask application and PostgreSQL database.
  </li>
</ol>
