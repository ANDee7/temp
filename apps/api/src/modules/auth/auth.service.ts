import type { LoginInput } from "./auth.schemas.js";

const mockUsers = [
  {
    id: "174326cb-e177-4de9-af2a-2008456ff908",
    phone: "+79991234567",
    password: "owner123",
    role: "owner" as const
  },
  {
    id: "7f4962e4-bbb4-401f-b816-42b9f2e20bf6",
    phone: "+79990000000",
    password: "staff123",
    role: "staff" as const
  }
];

export class AuthService {
  login(payload: LoginInput) {
    const foundUser = mockUsers.find(
      (user) => user.phone === payload.phone && user.password === payload.password
    );

    if (!foundUser) {
      return null;
    }

    return {
      userId: foundUser.id,
      role: foundUser.role
    };
  }
}
