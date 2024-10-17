"use client";

import { User } from '@/lib/types';
import { Alert, Button, Flex, Loader, Table } from '@mantine/core';
import { useEffect, useState } from 'react';

interface UserWithStorage extends User {
    // Add the storageUsage property
    storageUsage?: number | string | undefined;
}

export default function AdminUserHandling({ admin }: { admin: User }) {
    const [message, setMessage] = useState<string>('');
    const [users, setUsers] = useState<UserWithStorage[] | null>(null);
    const [deletingUser, setDeletingUser] = useState<boolean>(false);

    async function deleteUser(email: string) {
        if (email === admin.email) {
            setMessage("You cannot delete yourself");
            return;
        }

        try {
            setDeletingUser(true);
            const response = await fetch(`/api/account/delete/deleteAsAdmin`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, adminEmail: admin.email })
            });

            const data = await response.json();

            if (data.ok) {
                setMessage("User deleted successfully");
                await getUsers();
                setDeletingUser(false);
            }

            if (!data.ok) {
                setDeletingUser(false);
                throw new Error(data.message);
            }
        } catch(e) {
            setMessage("Could not delete user");
            console.error(e);
        }
    }

    async function getUsers() {
        try {
            const users = await fetch(`/api/account/getUsers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await users.json();

            if (data.ok) {
                setUsers(data.users);
            }

            if (!data.ok) {
                throw new Error(data)
            }
        } catch (e) {
            setMessage("Could not fetch users");
            return console.error(e);
        }
    }

    useEffect(() => {
        if (admin.role === "ADMIN") {
            getUsers();
        }
    }, [admin.role]);

    useEffect(() => {
        async function getStorageUsage() {
            if (users === null) {
                return;
            }

            for (const user of users) {
                try {
                    const storage = await fetch(`/api/account/getStorageUsage?id=${user.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });

                    const data = await storage.json();

                    if (data.ok) {
                        // Convert to MB (from bytes) and round
                        user.storageUsage = Math.round((data.storageUsage / 1024 / 1024) * 100) / 100;
                    }

                    if (!data.ok) {
                        user.storageUsage = "?";
                        throw new Error(data.message);
                    }
                } catch (error) {
                    console.error(`Failed to fetch storage usage for user ${user.id}:`, error);
                }
            }
        }

        getStorageUsage();
    }, [users]);

    return (
        <>
        <Flex direction={"column"} align={"center"} m={"auto"}>
            {
                message &&
                <Alert variant="light" color="red" maw={"300px"} w={"90%"} m={"sm"}>
                    {message}
                </Alert>
            }
            <Table highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Storage Usage</Table.Th>
                    <Table.Th>Verified</Table.Th>
                    <Table.Th>Delete User</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                {
                    users && users?.map((user) => (
                        <Table.Tr key={user.id}>
                            <Table.Td>{user.id}</Table.Td>
                            <Table.Td>{user.email}</Table.Td>
                            <Table.Td>{user.storageUsage !== undefined ? `${user.storageUsage} MB` : <Loader h={"1rem"} size={"sm"} />}</Table.Td>
                            <Table.Td>{user.verified.toString()}</Table.Td>
                            <Table.Td><Button onClick={() => deleteUser(user.email)} disabled={deletingUser}>Delete</Button></Table.Td>
                        </Table.Tr>
                    ))
                }
                </Table.Tbody>
            </Table>
        </Flex>
        </>
    )
}