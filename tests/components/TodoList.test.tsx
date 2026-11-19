
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import "@testing-library/jest-dom/vitest";

import TodoList from "../../src/components/tasks/TodoList";
import type { Task } from "../../src/types/task";



const task: Task = {
    id: "task-1",
    userId: "user-1",
    title: "Completar proyecto",
    description: "Finalizar el CRUD",
    completed: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
};



describe("TodoList", () => {

    it("muestra las tareas recibidas", () => {
        render(
            <TodoList
                tasks={[task]}
                onToggle={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(
            screen.getByText("Completar proyecto")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Finalizar el CRUD")
        ).toBeInTheDocument();
    });



    it("muestra un mensaje cuando no existen tareas", () => {
        render(
            <TodoList
                tasks={[]}
                onToggle={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(
            screen.getByText("No tienes tareas pendientes.")
        ).toBeInTheDocument();
    });



    it("permite completar, editar y eliminar una tarea", async () => {
        const user = userEvent.setup();

        const onToggle = vi.fn().mockResolvedValue(undefined);
        const onEdit = vi.fn();
        const onDelete = vi.fn().mockResolvedValue(undefined);

        render(
            <TodoList
                tasks={[task]}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        );

        const item = screen.getByText("Completar proyecto")
            .closest("li");

        expect(item).not.toBeNull();

        const taskItem = within(item!);
        // Primero, solicitar la eliminación
        await user.click(
            screen.getByRole("button", { name: "Eliminar" })
        );

        // Comprobar que aparece la confirmación
        expect(
            screen.getByRole("alertdialog")
        ).toBeInTheDocument();

        // Confirmar la eliminación
        await user.click(
            screen.getByRole("button", { name: "Sí, eliminar" })
        );

        // Verificar que se ejecutó el callback
        expect(onDelete).toHaveBeenCalledWith("task-1");
    });

});
