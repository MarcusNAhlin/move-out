import { Flex, Title } from "@mantine/core";

export default function Home() {
  return (
    <>
      <main
        style={{
          height: "100vh",
          width: "100vw",
        }}>
        <Flex
          justify="center"
          align="center"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <div>
            <Title order={1}>MoveOut</Title>
          </div>
        </Flex>
      </main>
    </>
  );
}
