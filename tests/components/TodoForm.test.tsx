
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import TodoForm from "../../src/components/tasks/TodoForm";




describe("TodoForm", () => {

    it("permite crear una tarea correctamente", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(true);

        render(<TodoForm onSubmit={onSubmit} />);

        await user.type(
            screen.getByLabelText("Título de la tarea"),
            "Estudiar React"
        );

        await user.type(
            screen.getByLabelText("Descripción"),
            "Repasar componentes"
        );

        await user.click(
            screen.getByRole("button", { name: "Crear tarea" })
        );

        expect(onSubmit).toHaveBeenCalledWith({
            title: "Estudiar React",
            description: "Repasar componentes",
        });
    });



    it("valida que el título sea obligatorio", async () => {
        const user = userEvent.setup();

        render(<TodoForm onSubmit={vi.fn()} />);

        await user.click(
            screen.getByRole("button", { name: "Crear tarea" })
        );

        expect(screen.getByRole("alert"))
            .toHaveTextContent("El título es obligatorio.");
    });



    it("permite cancelar una edición", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(true);
        const onCancel = vi.fn();

        render(
            <TodoForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                initialValues={{
                    title: "Tarea anterior",
                    description: "Descripción anterior",
                }}
            />
        );

        await user.click(
            screen.getByRole("button", { name: "Cancelar" })
        );

        expect(onCancel).toHaveBeenCalled();
    });

});
