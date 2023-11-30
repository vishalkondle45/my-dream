import Balance from "./Balance";
import { Stack, Text } from "@mantine/core";

const Balances = ({ expenses, paidBy, splitAmong, users, user }) => {
  return (
    <>
      <Text my="xs">My Balances</Text>
      <Stack gap="xs">
        {users
          ?.filter(({ userId }) => userId !== user?.subject)
          .map((item) => (
            <Balance
              key={item._id}
              expenses={expenses}
              paidBy={paidBy}
              splitAmong={splitAmong}
              users={users}
              user={user}
              item={item}
            />
          ))}
      </Stack>
    </>
  );
};

export default Balances;
