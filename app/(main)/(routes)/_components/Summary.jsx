import { Accordion, Text } from "@mantine/core";
import SpendingItem from "./SpendingItem";
import SummarySingleItem from "./SummarySingleItem";

const Summary = ({ expenses, splitAmong, paidBy, users, user, group }) => {
  const groupSpendings = expenses?.reduce((n, { amount }) => n + amount, 0);

  const getSpendings = (userId) =>
    paidBy
      ?.filter((item) => item.user === userId)
      ?.reduce((n, { amount }) => n + amount, 0);

  const getShare = (userId) =>
    splitAmong
      ?.filter((item) => item.user === userId)
      ?.reduce((n, { amount }) => n + amount, 0);

  const getBalance = (userId) =>
    getSpendings(userId) + 0 - (getShare(userId) + 0);

  return (
    <>
      <SummarySingleItem
        my="xs"
        title="Total Group Spending"
        value={groupSpendings}
        fw={700}
      />
      <SpendingItem
        name={"Your Spending Summary"}
        spendings={getSpendings(user?.subject)}
        share={getShare(user?.subject)}
        balance={getBalance(user?.subject)}
        color="red"
      />
      <Accordion
        styles={{ content: { padding: 0 }, control: { padding: 0 } }}
        defaultValue="Others"
        variant="default"
        radius="xs"
        mt="xs"
      >
        <Accordion.Item value="Others">
          <Accordion.Control>
            <Text fw={600}>Other Spending Summary</Text>
          </Accordion.Control>
          <Accordion.Panel mb="md">
            {users
              ?.filter((item) => item.userId !== user.subject)
              ?.map((user) => (
                <SpendingItem
                  key={user._id}
                  name={user.name.split(" ")[0]}
                  spendings={getSpendings(user.userId)}
                  share={getShare(user.userId)}
                  balance={getBalance(user.userId)}
                  color="orange"
                />
              ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default Summary;
