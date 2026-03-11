# Take Home Project Assessment

**Important Note on AI-Assisted Tools**: While we encourage the use of AI-based tools (such as GitHub Copilot, Claude Code, or similar) as reference materials or for assistance with syntax and documentation lookup, this assessment is designed to evaluate your technical abilities and problem-solving approach. Please do not ask an LLM to implement entire solutions or major portions of this project for you. We're interested in seeing how you approach problems, structure your code, and make technical decisions. If you do use AI tools to generate any code or solutions during this assessment, please be transparent about it during the review discussion. Honesty about your process is valued and will not negatively impact your evaluation.

### Overview

This API is meant to be used as a Data Aggregator for emissions data, using the Scope3 `/measure` endpoint to calculate the total emissions of a given domain (inventory ID). Documentation for this API endpoint can be found here: https://docs.scope3.com/reference/measure-1. For testing, a list of valid domains can be found in the [`VALID_DOMAINS.txt` file](./VALID_DOMAINS.txt).

This should take no longer than 2 hours to complete, please do not exceed this time limit. We will discuss your implementation in detail at a follow up meeting, along with pair-programming another assessment. If you have any questions or need clarification, please feel free to reach out to [bminer@scope3.com](mailto:bminer@scope3.com).

You may use all of the usual tools at your disposal, including installing any additional dependencies you may need.

### Project Structure

- **Server Entrypoint**: [`src/server.ts`](./src/server.ts) - Express server configuration and middleware setup
- **Measure Service API**: [`src/services/measure/api.ts`](./src/services/measure/api.ts) - Scope3 API client for emissions calculations
- **Emissions Router**: [`src/routers/emissions/index.ts`](./src/routers/emissions/index.ts) - API routes for emissions endpoints

_NOTE_: The Measure Service API client is already implemented for you to use, you _do not_ need to implement it yourself. However, feel free to modify it for your own needs, if you wish.

### TODOs

Currently, this API only has one emissions endpoint (`/emissions/day`), which fetches the `totalEmissions` for a given domain on a given date. We want to expand this API to perform more complex data aggregation.

- Create a robust middleware function for parsing and validating inputted query parameters for the `/emissions` router
  - Currently, you can pass anything as the `domain` and `date` query parameters. The middleware should validate that the `domain` is a syntactically valid domain name (e.g., using a regex or Zod's built-in URL/string validations) and the `date` is a valid date in the format `YYYY-MM-DD`.
  - This middleware should be dynamic and reusable for any future endpoints that require similar validation. Use Zod for schema validation (already installed)
- Implement the `/emissions/day` endpoint improvements
  - The existing endpoint should be enhanced to use your new validation middleware
  - Response structure:
    ```json
    {
      "totalEmissions": number,
      "domain": string,
      "date": string
    }
    ```
- Implement the `/emissions/week` endpoint
  - Endpoint must take `domain` and `date` query parameters.
  - Using the Measure API, get the `totalEmissions` for each date in the week, where the starting day is the provided date. The endpoint should return a **400 Bad Request** if the date is missing or malformed, and a **422 Unprocessable Entity** if the date is in the future (since emissions data doesn't exist yet).
  - Sum all values to calculate the total emissions for the week, including high, low, and average calculations for the week.
  - Response structure:
    ```json
    {
      "totalEmissions": number,
      "dates": string[],
      "domain": string,
      "high": {
        "date": string,
        "value": number
      },
      "low": {
        "date": string,
        "value": number
      },
      "average": number
    }
    ```
- Implement the `/emissions/month` endpoint
  - Endpoint must take `domain` and `date` query parameters. The `date` should be in `YYYY-MM` format (e.g., `"2025-01"`). Full dates like `"2025-01-15"` should return a **400 Bad Request**.
  - Response structure:
    ```json
    {
      "totalEmissions": number,
      "month": string,
      "domain": string,
      "high": {
        "date": string,
        "value": number
      },
      "low": {
        "date": string,
        "value": number
      },
      "average": number
    }
    ```
  - Using the Measure API, get the `totalEmissions` for each date of the month, where the starting day is the first of the month specified. The endpoint should return a **400 Bad Request** if the date is missing or malformed, and a **422 Unprocessable Entity** if the month includes future dates.
  - Sum all values to calculate the total emissions for the month for the given domain, along with calculating high, low, and average emissions for the month.

### Evaluation Criteria

When reviewing your submission, we'll be assessing the following aspects:

#### Performance & Efficiency

- **Parallel processing**: Implement solutions that fetch data concurrently rather than sequentially. The `/week` and `/month` endpoints will need to make multiple API calls, these should be optimized to run in parallel.
- **Response time**: Our system has a 30-second HTTP timeout limit. Your implementation should return responses well under this threshold, even for the `/month` endpoint which requires fetching ~30 days of data.
- **Error handling**: Gracefully handle API failures and network issues without blocking the entire request.

#### Code Quality & Architecture

- **Reusability**: Avoid code duplication between endpoints. Extract shared logic where you see fit that can be used across the `/day`, `/week`, and `/month` endpoints.
- **Maintainability**: Write clean, well-organized code that would be easy for other developers to understand and extend.

#### Middleware & Validation

- **Dynamic validation**: Create a flexible middleware system that can validate different query parameter schemas without duplicating validation logic.
- **Zod integration**: Use Zod schemas to define and enforce parameter validation rules in a type-safe manner.
- **Error responses**: Return appropriate HTTP status codes (400 for malformed input, 422 for valid but unprocessable data like future dates, etc.) with clear error messages.

#### Bonus Considerations

- Thoughtful edge case handling (e.g., leap years, month boundaries, timezone considerations)
- Logging and observability for debugging and monitoring (there is a configured [logging system](./src/logger.ts) already in place, use or improve this if you wish!)

### Next Steps

After you submit your assessment, the scheduled follow-up interview session will consist of two parts:

1. **Code review and discussion**: We'll review your implementation together, walk through your code, discuss your design decisions, and explore the trade-offs you considered during development.
2. **Live pair-programming exercise**: In the same session, we'll collaboratively enhance your solution with additional features or improvements through a live coding exercise.

### Submission Instructions

Once you have completed the assessment, please submit your work using one of the following methods:

#### Option 1: GitHub Repository (Preferred)

Push your completed project to a **public** GitHub repository and email the repository URL to [bminer@scope3.com](mailto:bminer@scope3.com).

#### Option 2: Compressed Archive

Create a zip file of your project directory, **excluding the `node_modules` folder**, and email it to [bminer@scope3.com](mailto:bminer@scope3.com).

You can use the following command to create a properly compressed archive:

```bash
# From the project root directory
zip -r takehome-submission.zip . -x "node_modules/*" -x ".git/*"
```

Please include your name in the email subject line (e.g., "Take Home Assessment - [Your Name]").
