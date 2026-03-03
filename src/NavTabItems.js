const NavTabItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    allowedRoles: ["admin", "counseller", "hr"],
  },

  {
    label: "Students",
    path: "/students",
    allowedRoles: ["admin", "counseller"],
  },

  {
    label: "Courses",
    path: "/courses",
    allowedRoles: ["admin"],
  },

  {
    label: "Resumes",
    path: "/resumes",
    allowedRoles: ["admin", "hr", "counseller"],
  },

  {
    label: "Placements",
    path: "/placements",
    allowedRoles: ["admin", "hr"],
  },

  {
    label: "Alumni",
    path: "/alumni",
    allowedRoles: ["admin", "counseller"],
  },

  {
    label: "Create User",
    path: "/signup",
    allowedRoles: ["admin"],
  },

  {
    label: "Profile",
    path: "/profile",
    allowedRoles: ["admin", "counseller", "hr"],
  },
];

export default NavTabItems;
