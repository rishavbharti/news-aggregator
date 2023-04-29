function getCookie(req, name) {
  const cookies = req.headers?.cookie?.split(';');
  if (!cookies) return null;

  const cookie = cookies.find((cookie) => {
    const _cookie = cookie?.split('=');
    return _cookie?.[0] === name;
  });

  if (cookie) return cookie.split('=')?.[1];

  return null;
}

export { getCookie };
