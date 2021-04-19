export default (url, ...args) => (
  fetch(url, ...args).then((res) => {
    if (!res) throw new Error('Responce object is undefined');
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return res.json();
    } else {
     return res.text();
    }
  })
);
