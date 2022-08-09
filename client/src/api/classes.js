export const getEnabledClasses = async () => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/classes/enabled`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    return await res.json();
  } catch (e) {
    console.log(e);
  }
};

export const deleteClass = async(id) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/classes/delete/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    return await res.json();
  } catch (e) {
    console.log(e);
  }
}
