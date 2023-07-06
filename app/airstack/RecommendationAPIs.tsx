"use client";
import { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  getNFTHolders,
  getNFTs,
  getPoapHolders,
  getPoaps,
  getRecommendationsByTokenTransfers,
} from "../../api";

const URI = "https://api.airstack.xyz/gql";

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});

export function RecommendationAPIs() {
  const [recommendMode, setRecommendMode] = useState("transfers");
  const [lensHandle, setLensHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [followList, setFollowList] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    if (!lensHandle || !lensHandle.includes(".lens")) return;
    setFollowList([]);
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
          const { data: nftHoldersData } = await client.query({
            query: getNFTHolders,
            variables: {
              // List of NFT held by `lensHandle`
              address: [
                ...(ethereumTokenBalances ?? [])?.map(
                  ({ tokenAddress }) => tokenAddress
                ),
                ...(polygonTokenBalances ?? [])?.map(
                  ({ tokenAddress }) => tokenAddress
                ),
              ],
            },
            context: {
              headers: {
                authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
              },
            },
          });
          const { ethereum: ethereumNFTHolders, polygon: polygonNFTHolders } =
            nftHoldersData || {};
          setFollowList(
            [
              ...(ethereumNFTHolders?.TokenNft ?? []),
              ...(polygonNFTHolders?.TokenNft ?? []),
            ]
              ?.map(({ tokenBalances }) => {
                if (!tokenBalances) return;
                return tokenBalances?.map(
                  ({ owner }) =>
                    owner?.socials?.find(({ dappName }) => dappName === "lens")
                      ?.profileName
                );
              })
              ?.flat(1)
              ?.filter(Boolean)
              ?.filter((value, index, array) => array.indexOf(value) === index)
          );
          break;
        case "poaps":
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
          const { data: poapHoldersData } = await client.query({
            query: getPoapHolders,
            variables: {
              eventId: Poaps?.Poap.map(({ eventId }) => eventId) ?? [],
            },
            context: {
              headers: {
                authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
              },
            },
          });
          setFollowList(
            poapHoldersData?.Poaps?.Poap?.map(
              ({ owner }) =>
                owner?.socials?.find(({ dappName }) => dappName === "lens")
                  ?.profileName
            )
          );
          break;
        case "transfers":
        default:
          const { data: tokenTransfersData } = await client.query({
            query: getRecommendationsByTokenTransfers,
            variables: {
              address: lensHandle,
            },
            context: {
              headers: {
                authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
              },
            },
          });
          const { ethereum, polygon } = tokenTransfersData || {};
          const { TokenTransfer: ethereumTokenTransfers } = ethereum || {};
          const { TokenTransfer: polygonTokenTransfers } = polygon || {};
          setFollowList(
            [
              ...(ethereumTokenTransfers ?? []),
              ...(polygonTokenTransfers ?? []),
            ]
              .map((transfer) => {
                if (
                  !transfer?.from?.socials?.find?.(
                    ({ profileName }) =>
                      profileName === lensHandle.toLowerCase()
                  )
                ) {
                  return transfer?.from?.socials?.find(
                    ({ dappName }) => dappName === "lens"
                  )?.profileName;
                } else if (
                  !transfer?.to?.socials?.find?.(
                    ({ profileName }) =>
                      profileName === lensHandle.toLowerCase()
                  )
                ) {
                  return transfer?.to?.socials?.find(
                    ({ dappName }) => dappName === "lens"
                  )?.profileName;
                } else {
                  return;
                }
              })
              // Filter to remove any undefined values (no lens found)
              .filter(Boolean)
              // Filter to only get unique value
              .filter((value, index, array) => array.indexOf(value) === index)
          );
          break;
      }
      setLoading(false);
    } catch (err) {
      console.log("error fetching follow recommendation ...", err);
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="font-bold mt-4">Recommendation Engine</p>
      <div>
        <p className="text-sm mt-3 mb-2 text-slate-400">Recommend By</p>
        <div>
          <Button
            text="Token Transfers"
            onClick={() => setRecommendMode("transfers")}
            className={`
            ${recommendMode === "transfers" ? "bg-purple-500" : "bg-purple-400"}
            `}
          />
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
          text="Get follow recommendations"
          className="bg-green-500 mt-2 mb-4"
          onClick={fetchRecommendations}
        />
      </div>
      <div className="mt-3 p-2">
        {followList.map((lensProfile, index) => (
          <p key={index}>{lensProfile}</p>
        ))}
        {loading && <Loading className="mt-4" />}
      </div>
    </div>
  );
}
