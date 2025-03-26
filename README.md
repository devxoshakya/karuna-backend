# karuna-backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

## API Guide

### Diagnosis Endpoint
- **Endpoint**: `api/diagnosis`
- **Method**: `POST`
- **Description**: Analyzes symptoms provided by the user and returns a diagnosis, recommended medications, specialist consultation, dietary suggestions, and a disclaimer.
- **Request Body**:
  ```json
  {
    "symptoms": "string"
  }
  ```
- **Response**:
  - **Success**: Returns a JSON object with keys `diagnosis`, `medications`, `prescription`, `specialist`, `dietary_suggestions`, and `disclaimer`.
  - **Error**: Returns a 400 status with an error message if symptoms are invalid, or a 500 status if there's a failure in generating a diagnosis.

### Medicine Endpoints
- **Search Medicine by Name**
  - **Endpoint**: `api/medicine`
  - **Method**: `POST`
  - **Description**: Searches for medicines based on a prescription array.
  - **Request Body**:
    ```json
    {
      "prescription": ["medicine1", "medicine2"]
    }
    ```
  - **Response**:
    - **Success**: Returns a list of found medicines with their details.
    - **Error**: Returns a 400 status if the prescription array is invalid, a 404 status if no medicines are found, or a 500 status for internal errors.

- **Get All Medicines**
  - **Endpoint**: `api/medicine`
  - **Method**: `GET`
  - **Description**: Retrieves all medicines from the database.
  - **Response**:
    - **Success**: Returns a list of all medicines.
    - **Error**: Returns a 404 status if no medicines are found, or a 500 status for internal errors.

### Chat Endpoints
-*Ek baar check the templates/chat.html phir sahi se smjh aayega*
- **Start Chat**
  - **Endpoint**: `api/chat/start`
  - **Method**: `POST`
  - **Description**: Initiates a new chat session and returns a session ID.
  - **Response**:
    - **Success**: Returns a session ID for the chat.
    - **Error**: Not applicable as per the current implementation.

- **Send Message**
  - **Endpoint**: `api/chat/message`
  - **Method**: `POST`
  - **Description**: Sends a message in an existing chat session and receives a reply.
  - **Request Body**:
    ```json
    {
      "sessionId": "string",
      "message": "string"
    }
    ```
  - **Response**:
    - **Success**: Returns a reply from the AI model.
    - **Error**: Returns a 400 status if fields are missing, a 404 status if the session is not found, or a 500 status for processing errors.

### Report Endpoint
- **Endpoint**: `api/report`
- **Method**: `POST`
- **Description**: Processes an uploaded PDF report, analyzes it using Gemini AI, and returns a diagnosis, recommended medications, specialist consultation, dietary suggestions, and a disclaimer.
- **Request**:
  - **File**: A PDF file uploaded as part of the request.
- **Response**:
  - **Success**: Returns a JSON object with keys `diagnosis`, `medications`, `prescription`, `specialist`, `dietary_suggestions`, and `disclaimer`.
  - **Error**: Returns a 400 status if no file is uploaded, or a 500 status if there's a failure in processing the PDF report.

### Data Endpoints

- **Fetch All Doctors**
  - **Endpoint**: `api/data/docs`
  - **Method**: `GET`
  - **Description**: Retrieves all doctors from the database.
  - **Response**:
    - **Success**: Returns a list of all doctors.
    - **Error**: Returns a 500 status if there's a failure in fetching doctors.

- **Fetch All Hospitals**
  - **Endpoint**: `api/data/hospitals`
  - **Method**: `GET`
  - **Description**: Retrieves all hospitals from the database.
  - **Response**:
    - **Success**: Returns a list of all hospitals.
    - **Error**: Returns a 500 status if there's a failure in fetching hospitals.

- **Search Doctors by Name**
  - **Endpoint**: `api/data/docs`
  - **Method**: `POST`
  - **Description**: Searches for doctors by name using a case-insensitive regex.
  - **Request Body**:
    ```json
    {
      "name": "doctor name"
    }
    ```
  - **Response**:
    - **Success**: Returns a list of doctors matching the search criteria.
    - **Error**: Returns a 500 status if there's a failure in searching doctors.

- **Search Hospitals by Name**
  - **Endpoint**: `api/data/hospitals`
  - **Method**: `POST`
  - **Description**: Searches for hospitals by name using a case-insensitive regex.
  - **Request Body**:
    ```json
    {
      "name": "hospital name"
    }
    ```
  - **Response**:
    - **Success**: Returns a list of hospitals matching the search criteria.
    - **Error**: Returns a 500 status if there's a failure in searching hospitals.
