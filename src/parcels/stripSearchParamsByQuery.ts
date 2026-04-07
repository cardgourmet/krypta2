/*const stripSearchParamsByQuery: SearchMiddleware<Required<TcgSearchParams>> = ({ search, next }) => {
  const result = { ...next(search) } as Record<string, unknown>;
  const query = result.query as string | undefined;

  // const normalDefaults = tcgSearchParamsDefaults as Record<string, unknown>;
  let defaults = tcgSearchParamsDefaults;
  const isSetSpecific = getSetSpecificQuery(query ?? '') !== null;
  if (isSetSpecific) {
    defaults = tcgSetSearchParamsDefaults;
  }

  Object.entries(defaults as Record<string, unknown>).forEach(([key, value]) => {
    /!*if (isSetSpecific && result[key] === normalDefaults[key]) {
      console.log(`set result of '${key}' to '${value}'`);
      result[key] = value;
    }*!/

    if (deepEqual(result[key], value)) {
      delete result[key];
    }
  });

  return result as Required<TcgSearchParams>;
};*/
