import { axiosClient } from "../axiosClient";

export const RBACService = {
  // Roles
  getRoles: async () => {
    const response = await axiosClient.get("/rbac/roles");
    return response.data;
  },

  createRole: async (data: { name: string; description: string }) => {
    const response = await axiosClient.post("/rbac/roles", data);
    return response.data;
  },

  assignRoleToUser: async (userId: string, roleId: number) => {
    const response = await axiosClient.post(`/rbac/users/${userId}/roles`, {
      roleId,
    });
    return response.data;
  },

  // Permissions
  getPermissions: async () => {
    const response = await axiosClient.get("/rbac/permissions");
    return response.data;
  },

  createPermission: async (data: {
    resource: string;
    action: string;
    description: string | null;
  }) => {
    const response = await axiosClient.post("/rbac/permissions", data);
    return response.data;
  },

  assignPermissionToRole: async (roleId: number, permissionId: number) => {
    const response = await axiosClient.post(
      `/rbac/roles/${roleId}/permissions`,
      { permissionId },
    );
    return response.data;
  },

  getRolePermissions: async (roleId: number) => {
    const response = await axiosClient.get(`/rbac/roles/${roleId}/permissions`);
    return response.data;
  },

  unassignPermissionFromRole: async (roleId: number, permissionId: number) => {
    const response = await axiosClient.delete(
      `/rbac/roles/${roleId}/permissions/${permissionId}`,
    );
    return response.data;
  },

  // Invitations
  inviteUser: async (data: { email: string; roleName: string }) => {
    const response = await axiosClient.post("/auth/invite", data);
    return response.data;
  },
};
