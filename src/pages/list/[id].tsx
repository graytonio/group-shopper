import { Tab } from "@headlessui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { AiOutlineLoading } from "react-icons/ai";
import { classNames } from "../../utils/styles";
import { User, Item, ItemInList } from "@prisma/client";
import { BsFillCartXFill, BsFillCartPlusFill } from "react-icons/bs";

const UserTabTitle = ({ name }: { name: string }) => (
  <Tab
    className={({ selected }) =>
      classNames("w-full rounded-lg py-2.5 px-4 text-lg font-bold leading-5 text-blue-700", selected ? "bg-white shadow-md" : "text-blue-300 hover:bg-white/[0.12] hover:text-white")
    }
  >
    {name}
  </Tab>
);

const ItemCard = ({
  item,
}: {
  item: ItemInList & {
    item: Item;
    assigned: User;
  };
}) => {
  return (
    <div className={classNames("px-4 py-5 text-bold shadow-md rounded-md", item.purchased ? "bg-green-400" : "bg-red-400")}>
      <div className="flex justify-between">
        <div>
          {item.item.name} {item.size ? `(${item.size})` : null}
        </div>
        <div className="font-bold">{item.quantity}</div>
      </div>
      <div className="flex flex-row-reverse">
        {item.purchased ? (
          <button className="text-2xl text-red-600">
            <BsFillCartXFill />
          </button>
        ) : (
          <button className="text-2xl">
            <BsFillCartPlusFill />
          </button>
        )}
      </div>
    </div>
  );
};

const UserTabPanel = ({ user, listId }: { user: User; listId: string }) => {
  const { data: items, error, isLoading } = trpc.useQuery(["list.items", { listId: listId, userId: user.id }]);

  if (!items || isLoading) {
    return (
      <div className="text-6xl flex gap-4">
        Loading <AiOutlineLoading className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <ItemCard key={item.itemId} item={item} />
      ))}
    </div>
  );
};

const ListPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: list, error, isLoading } = trpc.useQuery(["list.getList", { id: id as string }]);
  const newitem = trpc.useMutation(["list.additem"]);

  if (!list || isLoading) {
    return (
      <>
        <Head>
          <title>Loading...</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-6xl flex gap-4">
            Loading <AiOutlineLoading className="animate-spin" />
          </div>
        </main>
      </>
    );
  }

  const addNewItem = () => {
    newitem.mutate({ name: "Cereal", listId: id as string, quantity: 3, assignedId: list.ownerId });
  };

  return (
    <>
      <Head>
        <title>My List</title>
        <meta name="description" content="My Shopping List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center min-h-screen p-4 bg-gray-400">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl py-2 w-full">
            <UserTabTitle name={list.owner.name || "User"} />
            {list.users.map((user) => (
              <UserTabTitle key={user.id} name={user.name || "User"} />
            ))}
          </Tab.List>
          <button onClick={addNewItem} className="w-full p-2 bg-blue-400 rounded-md text-white text-xl font-bold shadow-md">
            Add Item
          </button>
          <Tab.Panels className="mt-2 w-full">
            <UserTabPanel user={list.owner} listId={id as string} />
          </Tab.Panels>
        </Tab.Group>
      </main>
    </>
  );
};

export default ListPage;
