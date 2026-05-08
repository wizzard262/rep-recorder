export type RepSetScheme = {
  id: string;
  date: string;
  exerciseMovement: { name: string; type: string, isCompound: boolean };
  kilogramMass: number;
  repetitions: number;
};

export type CreateRepSetSchemeRequest = Omit<
  RepSetScheme,
  "id"
>;

// For update, we want to allow the client to update all fields except id, which is set by the server and should not be changed by the client.
export type UpdateRepSetSchemeRequest = Omit<RepSetScheme, "id" | "createdAt">;
