"use client";
import { useState, useEffect } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getRecommendationsByTokenTransfers } from "../../api";

const URI = "https://api.airstack.xyz/gql";

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});

export function RecommendationAPIs() {
  const [recommendMode, setRecommendMode] = useState("nfts");
  const [lensHandle, setLensHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [followList, setFollowList] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    if (!lensHandle) return;
    setFollowList([]);
    try {
      switch (recommendMode) {
        case "nfts":
        case "poaps":
        case "transfers":
        default:
          setLoading(true);
          const { data } = await client.query({
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
          const { ethereum, polygon } = data || {};
          const { TokenTransfer: ethereumTokenTransfers = [] } = ethereum || {};
          const { TokenTransfer: polygonTokenTransfers = [] } = polygon || {};
          setFollowList(
            [...ethereumTokenTransfers, ...polygonTokenTransfers]
              .map((transfer) => {
                if (
                  transfer?.from?.socials?.find?.(
                    ({ profileName }) =>
                      profileName !== lensHandle.toLocaleLowerCase()
                  )
                ) {
                  return transfer?.from?.socials?.[0]?.profileName;
                } else if (
                  transfer?.to?.socials?.find?.(
                    ({ profileName }) =>
                      profileName !== lensHandle.toLocaleLowerCase()
                  )
                ) {
                  return transfer?.to?.socials?.[0]?.profileName;
                } else {
                  return;
                }
              })
              // Filter to remove any undefined values (no lens found)
              .filter(Boolean)
              // Filter to only get unique value
              .filter((value, index, array) => array.indexOf(value) === index)
          );
          setLoading(false);
          break;
      }
    } catch (err) {
      console.log("error fetching follow recommendation ...", err);
      setLoading(false);
    }
  };

  console.log(followList);

  return (
    <div>
      <p className="font-bold mt-4">Recommendation Engine</p>
      <div>
        <p className="text-sm mt-3 mb-2 text-slate-400">Recommend By</p>
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
          <Button
            text="Token Transfers"
            onClick={() => setRecommendMode("transfers")}
            className={`
            ${recommendMode === "transfers" ? "bg-purple-500" : "bg-purple-400"}
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
        {recommendMode === "nfts" && <div>NFTs</div>}
        {recommendMode === "poaps" && <div>POAPs</div>}
        {recommendMode === "transfers" && <div></div>}
        {loading && <Loading className="mt-4" />}
      </div>
    </div>
  );
}
