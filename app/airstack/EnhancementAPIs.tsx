"use client";
import { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getNFTHolders, getNFTs, getPoapHolders, getPoaps } from "../../api";
import Modal from "react-modal";

const URI = "https://api.airstack.xyz/gql";

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});

const EnhancementAPIs = () => {
  const [recommendMode, setRecommendMode] = useState("nfts");
  let [lensHandle, setLensHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [profileGroups, setProfileGroups] = useState<any[]>([]); // List of relevant groups
  const [focusGroup, setFocusGroup] = useState<string>(""); // NFT or POAP that are focused
  const [groupUsers, setGroupUsers] = useState<any[]>([]); // List of users in the focused group

  const fetchProfileGroups = async () => {
    if (!lensHandle) return
    if (!lensHandle.includes(".lens")) {
      lensHandle = lensHandle + ".lens"
    }
    setProfileGroups([]);
    try {
      setLoading(true);
      switch (recommendMode) {
        case "nfts":
          const { data: nftsData } = await client.query({
            query: getNFTs,
            variables: {
              address: lensHandle,
            },
            context: {
              headers: {
                authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
              },
            },
          });
          const { ethereum: ethereumNFTsData, polygon: polygonNFTsData } =
            nftsData || {};
          const { TokenBalance: ethereumTokenBalances } =
            ethereumNFTsData || {};
          const { TokenBalance: polygonTokenBalances } = polygonNFTsData || {};
          setProfileGroups([
            ...(ethereumTokenBalances ?? []),
            ...(polygonTokenBalances ?? []),
          ]);
          break;
        case "poaps":
        default:
          const { data: poapsData } = await client.query({
            query: getPoaps,
            variables: {
              address: lensHandle,
            },
            context: {
              headers: {
                authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
              },
            },
          });
          const { Poaps } = poapsData || {};
          setProfileGroups(
            Poaps?.Poap?.map(({ eventId, poapEvent }) => ({
              eventId,
              image: poapEvent?.contentValue?.image?.small,
              name: poapEvent?.eventName,
            }))
          );
          break;
      }
      setLoading(false);
    } catch (err) {
      console.log("error fetching follow recommendation ...", err);
      setLoading(false);
    }
  };

  const fetchProfileUsers = async ({
    tokenAddress,
    eventId,
  }:
    | { tokenAddress: string; eventId?: string }
    | { tokenAddress?: string; eventId: string }) => {
    setModalLoading(true);
    setGroupUsers([]);
    try {
      switch (recommendMode) {
        case "nfts":
          if (tokenAddress) setFocusGroup(tokenAddress);
          const { data: nftHoldersData } = await client.query({
            query: getNFTHolders,
            variables: {
              address: [tokenAddress],
            },
            context: {
              headers: {
                authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
              },
            },
          });
          const { ethereum: ethereumNFTHolders, polygon: polygonNFTHolders } =
            nftHoldersData || {};
          setGroupUsers(
            [
              ...(ethereumNFTHolders?.TokenNft ?? []),
              ...(polygonNFTHolders?.TokenNft ?? []),
            ]
              ?.map(({ tokenBalances }) => {
                if (!tokenBalances) return;
                return tokenBalances;
              })
              ?.flat(1)
              ?.filter(Boolean)
              ?.filter((value, index, array) => {
                return (
                  array.findIndex(
                    (item) => item?.owner?.identity === value?.owner?.identity
                  ) === index
                );
              })
          );
          break;
        case "poaps":
          if (eventId) setFocusGroup(eventId);
          const { data: poapHoldersData } = await client.query({
            query: getPoapHolders,
            variables: {
              eventId,
            },
            context: {
              headers: {
                authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
              },
            },
          });
          const { Poaps } = poapHoldersData || {};
          setGroupUsers(
            Poaps?.Poap?.filter((value, index, array) => {
              return (
                array.findIndex(
                  (item) => item?.owner?.identity === value?.owner?.identity
                ) === index
              );
            })
          );
        default:
          break;
      }
      setModalLoading(false);
    } catch (e) {
      console.log("error fetching nft holders ...", e);
      setModalLoading(false);
    }
  };

  return (
    <div>
      <p className="font-bold mt-4">Profile Enhancements</p>
      <div>
        <p className="text-sm mt-3 mb-2 text-slate-400">Grouped By</p>
        <div>
          <Button
            text="NFTs"
            onClick={() => setRecommendMode("nfts")}
            className={`
            ${recommendMode === "nfts" ? "bg-purple-500" : "bg-purple-400"}
            `}
          />
          <Button
            text="POAPs"
            onClick={() => setRecommendMode("poaps")}
            className={`
            ${recommendMode === "poaps" ? "bg-purple-500" : "bg-purple-400"}
            `}
          />
        </div>
      </div>
      <div className="flex flex-col items-start">
        <Input
          placeholder="Lens Profile"
          className="w-96 mb-2 mt-4"
          onChange={(e) => {
            setLensHandle(e.target.value);
          }}
        />
        <Button
          text="Get profile groups"
          className="bg-green-500 mt-2 mb-4"
          onClick={fetchProfileGroups}
        />
      </div>
      <div className="mt-3 p-2 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
        {recommendMode === "nfts" &&
          profileGroups.map(({ tokenAddress, tokenNfts }, index) => (
            <div key={index}>
              <img
                src={tokenNfts?.contentValue?.image?.small ?? "/fallback.png"}
                alt="Token image"
                className="cursor-pointer"
                onClick={() => fetchProfileUsers({ tokenAddress })}
              />
              <div className="mt-4 flex justify-between">
                <h3 className="text-sm text-gray-700">
                  <b>
                    {tokenNfts?.metaData?.name?.slice(0, 50)}
                    {tokenNfts?.metaData?.name?.length > 50 && "..."}
                  </b>
                </h3>
              </div>
            </div>
          ))}
        {recommendMode === "poaps" &&
          profileGroups.map(({ eventId, image, name }, index) => (
            <div key={index}>
              <img
                src={image ?? "/fallback.png"}
                alt="Token image"
                className="cursor-pointer"
                onClick={() => fetchProfileUsers({ eventId })}
              />
              <div className="mt-4 flex justify-between">
                <h3 className="text-sm text-gray-700">
                  <b>
                    {name?.slice(0, 50)}
                    {name?.length > 50 && "..."}
                  </b>
                </h3>
              </div>
            </div>
          ))}
        {loading && <Loading className="mt-4" />}
        <Modal
          isOpen={focusGroup?.length > 0}
          onRequestClose={() => setFocusGroup("")}
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
          }}
        >
          <b className="text-lg">Community</b>
          <div className="container mt-2">
            {groupUsers.map(({ owner }, index) => (
              <div key={index} className="row border-b-2 py-2">
                <p>
                  {owner?.identity?.slice(0, 6)}...{owner?.identity?.slice(-6)}
                  {owner?.socials?.length > 0 && (
                    <>
                      {" · "}
                      {
                        owner?.socials?.find(
                          ({ dappName }) => dappName === "lens"
                        )?.profileName
                      }
                    </>
                  )}
                </p>
              </div>
            ))}
            {modalLoading && <Loading className="mt-4" />}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EnhancementAPIs;
