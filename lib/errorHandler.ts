export default (err: Error) => {
  if (err.message.startsWith("show:"))
    return { error: err.message.replace("show: ", "") };

  console.error(err);
  return {
    error: "S'ha produït un error. Si us plau, torna-ho a provar més tard.",
  };
};
