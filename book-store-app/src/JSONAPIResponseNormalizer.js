function JSONAPIResponseNormalizer(json) {
  const normalizedData = {};

  if (json.data && Array.isArray(json.data)) {
    json.data.forEach((resource) => {
      const { type, id, attributes, relationships } = resource;
      const resourceObject = { id, ...attributes };

      if (!normalizedData[type]) {
        normalizedData[type] = {};
      }

      normalizedData[type][id] = resourceObject;

      if (relationships) {
        Object.entries(relationships).forEach(([relationship, { data }]) => {
          if (Array.isArray(data)) {
            resourceObject[relationship] = data.map(({ type, id }) => ({ type, id }));
          } else if (data) {
            const { type, id } = data;
            resourceObject[relationship] = { type, id };
          }
        });
      }
    });
  }
  return normalizedData;
}

export default JSONAPIResponseNormalizer;
