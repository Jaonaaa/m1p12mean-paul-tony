export const devisPopulate = [
  {
    path: "services_details",
    populate: {
      path: "service",
    },
  },
  "id_client",
  "id_vehicle",
];

export const devisPopulateAll = [
  {
    path: "services_details",
    populate: [
      {
        path: "service",
        populate: [
          {
            path: "required_skills",
          },
          {
            path: "category",
          },
        ],
      },
      {
        path: "workers",
        populate: [
          {
            path: "skills",
          },
        ],
      },
    ],
  },
  "id_client",
  {
    path: "id_vehicle",
    populate: [
      {
        path: "id_type_vehicle",
      },
      {
        path: "id_brand_vehicle",
      },
    ],
  },
];
