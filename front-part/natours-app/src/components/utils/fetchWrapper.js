const baseURL = "http://localhost:1444/api/v1";
let loading;

export const fetchWrapper = async (
  url,
  body,
  method = "GET",
  anotherOptions = {}
) => {
  try {
    // Set loading to true
    loading = true;
    console.log(body, method);
    // Make the fetch request
    const response = await fetch(`${baseURL}${url}`, {
      method: method,
      body: JSON.stringify(body),
      credentials: "include",
      withCredentials: true,
    });
    console.log(111);
    console.log(response);
    // Get the response data
    const { message, status, data } = await response.json();

    // Set loading to false
    loading = false;

    // Return the data along with the status and message
    return {
      status,
      data,
      message,
      loading: loading,
    };
  } catch (error) {
    // Set loading to false
    loading = false;

    // Return an error object with the status code, message, and loading status
    return {
      status: error.status || 500,
      data: null,
      message: error.message || "Internal Server Error",
      loading: loading,
    };
  }
};
