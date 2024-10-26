import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UsersManager from "./UsersManager";

describe("UsersManager Component", () => {
  beforeEach(() => {
    // Simulation de la réponse de l'API
    global.fetch = jest.fn((url) => {
      if (url === "http://localhost:5000/api/users") {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                _id: "1",
                name: "John Doe",
                email: "john@example.com",
                role: "Admin",
                dateOfBirth: "1990-01-01",
                image: "image.jpg",
              },
            ]),
        });
      }
      if (url.startsWith("http://localhost:5000/api/users/")) {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error("Invalid URL"));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaurez les mocks après chaque test
  });

  test("renders users list", async () => {
    render(<UsersManager />);

    // Vérifiez que le composant a rendu le titre
    expect(screen.getByText(/Users Management/i)).toBeInTheDocument();

    // Attendez que la liste des utilisateurs soit chargée
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());
  });

  test("creates a new user", async () => {
    render(<UsersManager />);

    // Remplissez les champs de création d'utilisateur
    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: "User" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "1992-02-02" } });

    // Simulez la soumission du formulaire
    fireEvent.click(screen.getByText(/Create User/i));

    // Attendez que la requête de création soit effectuée
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/users/",
        expect.any(Object)
      );
    });
  });

  test("updates an existing user", async () => {
    render(<UsersManager />);

    // Attendez que la liste des utilisateurs soit chargée
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

    // Cliquez sur le bouton d'édition
    fireEvent.click(screen.getByText(/Edit/i));

    // Modifiez les informations de l'utilisateur
    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: "John Smith" } });

    // Simulez la soumission du formulaire de mise à jour
    fireEvent.click(screen.getByText(/Update User/i));

    // Attendez que la requête de mise à jour soit effectuée
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/users/1",
        expect.any(Object)
      );
    });
  });

  test("deletes a user", async () => {
    render(<UsersManager />);

    // Attendez que la liste des utilisateurs soit chargée
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

    // Cliquez sur le bouton de suppression
    fireEvent.click(screen.getByText(/Delete/i));

    // Attendez que la requête de suppression soit effectuée
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:5000/api/users/1", {
        method: "DELETE",
      });
    });
  });
});
