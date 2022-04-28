export default async function getEnvironment() {
  return new Promise((resolve) => {
    resolve({
      baseApi: process.env.NEXT_PUBLIC_BASE_API,
    });
  });
}
