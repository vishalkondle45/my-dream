import { Accordion, Text } from "@mantine/core";
import SpendingItem from "./SpendingItem";
import SummarySingleItem from "./SummarySingleItem";

const Summary = ({ expenses, splitAmong, paidBy, users, user, group }) => {
  const groupSpendings = expenses?.reduce((n, { amount }) => n + amount, 0);

  const nonSettlementExpenses = expenses
    .filter(({ isSettlement }) => !isSettlement)
    .map(({ _id }) => _id);

  const getSpendings = (userId) =>
    paidBy
      ?.filter(
        (item) =>
          item?.user === userId && nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

  const getPaids = (userId) =>
    paidBy
      ?.filter(
        (item) =>
          item?.user === userId &&
          !nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

  const getShare = (userId) =>
    splitAmong
      ?.filter(
        (item) =>
          item?.user === userId && nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

  const getReceived = (userId) =>
    splitAmong
      ?.filter(
        (item) =>
          item?.user === userId &&
          !nonSettlementExpenses.includes(item?.expense)
      )
      ?.reduce((n, { amount }) => n + amount, 0) || 0;

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
        paids={getPaids(user?.subject)}
        share={getShare(user?.subject)}
        received={getReceived(user?.subject)}
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
              ?.filter((item) => item?.userId !== user?.subject)
              ?.map((user) => (
                <SpendingItem
                  key={user?._id}
                  name={user?.name}
                  spendings={getSpendings(user?.userId)}
                  paids={getPaids(user?.userId)}
                  share={getShare(user?.userId)}
                  received={getReceived(user?.subject)}
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
