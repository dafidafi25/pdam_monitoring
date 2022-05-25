const getLocalStorage = () => {
  return new Promise((resolve) => {
    const user = localStorage.getItem("user")
      ? localStorage.getItem("user")
      : "";
    resolve(user);
  });
};

export default getLocalStorage;
