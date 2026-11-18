
import { beforeEach, describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { Timestamp } from "firebase/firestore";
import type { Task } from "../../src/types/task";

import { useTasks } from "../../src/hooks/useTasks";



const mocks = vi.hoisted(() => ({
    useAuth: vi.fn(),
    subscribeToTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    toggleTaskCompleted: vi.fn(),
    deleteTask: vi.fn(),
}));

vi.mock("../../src/hooks/useAuth", () => ({
    useAuth: mocks.useAuth,
}));



vi.mock(
    "../../src/services/firebase/taskService",
    async (importOriginal) => {
        const actual = await importOriginal<
            typeof import("../../src/services/firebase/taskService")
        >();

        return {
            ...actual,
            subscribeToTasks: mocks.subscribeToTasks,
            createTask: mocks.createTask,
            updateTask: mocks.updateTask,
            toggleTaskCompleted: mocks.toggleTaskCompleted,
            deleteTask: mocks.deleteTask,
        };
    }
);




const unsubscribe = vi.fn();

const task: Task = {
    id: "task-1",
    userId: "user-1",
    title: "Estudiar testing",
    description: "Practicar Vitest",
    completed: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
};

describe("useTasks", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        mocks.useAuth.mockReturnValue({
            user: { uid: "user-1" },
        });

        mocks.subscribeToTasks.mockReturnValue(unsubscribe);
        mocks.createTask.mockResolvedValue("task-1");
    });

    it("se suscribe a las tareas del usuario", () => {
        const { result, unmount } = renderHook(() => useTasks());

        expect(mocks.subscribeToTasks)
            .toHaveBeenCalledWith(
                "user-1",
                expect.any(Function),
                expect.any(Function)
            );

        unmount();

        expect(unsubscribe).toHaveBeenCalled();
    });


    it("crea tareas utilizando el servicio", async () => {
        const { result } = renderHook(() => useTasks());

        let success = false;

        await act(async () => {
            success = await result.current.createTask(
                "Nueva tarea",
                "Descripción"
            );
        });

        expect(success).toBe(true);

        expect(mocks.createTask).toHaveBeenCalledWith(
            "user-1",
            "Nueva tarea",
            "Descripción"
        );
    });


    it("maneja errores del servicio", async () => {
        mocks.createTask.mockRejectedValue(
            new Error("Error de Firebase")
        );

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.createTask("Tarea", "Descripción");
        });

        expect(result.current.error)
            .toBe("Error de Firebase");
    });

});
