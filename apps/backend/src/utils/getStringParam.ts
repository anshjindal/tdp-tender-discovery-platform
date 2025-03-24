// Parameter processing with type safety
const getStringParam = (param: string | string[] | undefined): string | undefined => {
    if (Array.isArray(param)) return param[0];
    return param;
};

export default getStringParam;