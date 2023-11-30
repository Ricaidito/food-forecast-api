const getDisplayOrigin = origin => {
  const ORIGINS = [
    { text: "MICM", originValue: "micmp" },
    { text: "La Sirena", originValue: "sirena" },
    { text: "El Nacional", originValue: "nacional" },
    { text: "Jumbo", originValue: "jumbo" },
  ];
  const originObj = ORIGINS.find(o => o.originValue === origin);
  return originObj ? originObj.text : "";
};

const getDisplayCategory = category => {
  const CATEGORIES = [
    { text: "Carnes", categoryValue: "carnes" },
    { text: "Granos", categoryValue: "granos" },
    { text: "Embutidos", categoryValue: "embutidos" },
    { text: "Lacteos", categoryValue: "lacteos" },
    { text: "Pan", categoryValue: "pan" },
    { text: "Vegetales", categoryValue: "vegetales" },
    { text: "Congelados", categoryValue: "congelados" },
    { text: "Deli", categoryValue: "deli" },
    { text: "Despensa", categoryValue: "despensa" },
    { text: "Galletas y Dulces", categoryValue: "galletas-y-dulces" },
    { text: "Listos para Comer", categoryValue: "listos-para-comer" },
    {
      text: "Panaderia y Reposteria",
      categoryValue: "panaderia-y-reposteria",
    },
    { text: "Pescados y Mariscos", categoryValue: "pescados-y-mariscos" },
    { text: "Alimentos para Bebe", categoryValue: "alimentos-para-bebe" },
    { text: "Aguas", categoryValue: "aguas" },
    { text: "Cervezas", categoryValue: "cervezas" },
    { text: "Hidratantes", categoryValue: "hidratantes" },
    { text: "Jugos", categoryValue: "jugos" },
    { text: "Licores", categoryValue: "licores" },
    { text: "Maltas", categoryValue: "maltas" },
    {
      text: "Refrescos y Energizantes",
      categoryValue: "refrescos-y-energizantes",
    },
    {
      text: "Suplementos y Proteinas",
      categoryValue: "suplementos-y-proteinas",
    },
    { text: "Vinos y Espumantes", categoryValue: "vinos-y-espumantes" },
    { text: "Cigarrillos", categoryValue: "cigarrillos" },
    { text: "Frutas Congeladas", categoryValue: "frutas-congeladas" },
    { text: "Frutas Frescas", categoryValue: "frutas-frescas" },
    { text: "Vegetales Congelados", categoryValue: "vegetales-congelados" },
  ];
  const categoryObj = CATEGORIES.find(c => c.categoryValue === category);
  return categoryObj ? categoryObj.text : "";
};

module.exports = {
  getDisplayOrigin,
  getDisplayCategory,
};
