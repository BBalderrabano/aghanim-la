export const register = async ({ username, password, laclass } = {}) => {
  const user = { username, password, laclass };

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (e) {
    throw new Error(`Cannot register at this moment, try again later, ${e}`);
  }
};

export const login = async ({ username, password } = {}) => {
  const user = { username, password };

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (e) {
    throw new Error(`Cannot login at this moment, try again later, ${e}`);
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  } catch (e) {
    console.log(e);
  }
};

export const getLoggedInUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: "GET",
        credentials: "include",
      });
  
      return await res.json();
    } catch (e) {
      throw new Error("Please login to continue");
    }
  };
