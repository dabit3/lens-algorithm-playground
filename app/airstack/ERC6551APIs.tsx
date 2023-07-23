"use client";
import { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { erc6551UserBalance } from "../../api";

const URI = "https://api.airstack.xyz/gql";

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});

export function ERC6551APIs() {
  const [address, setAddress] = useState("");
  const [nfts, setNfts] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function fetchProfiles() {
    if (!address) return;
    try {
      setLoading(true);
      setMessage("");
      setNfts([]);
      const response = await client.query({
        query: erc6551UserBalance,
        /**
         * Address to test out:
         * - 0xa75b7833c78eba62f1c5389f811ef3a7364d44de: has NFT that has Lens (sapienz_0.lens)
         * - 0xcf94ba8779848141d685d44452c975c2ddc04945: has lot of ERC6551 accounts
         */
        variables: {
          owner: address,
        },
        context: {
          headers: {
            authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
          },
        },
      });
      const { TokenBalances } = response.data;
      setNfts(TokenBalances?.TokenBalance);
      setLoading(false);
    } catch (err) {
      console.log("error fetching profiles ...", err);
      setLoading(false);
    }
  }
  return (
    <div className="mt-4">
      <p className="font-bold mt-4 mb-4">Get ERC6551 Accounts</p>
      <div className="flex flex-col items-start">
        <Input
          placeholder="Ethereum address, Lens Profile, or ENS"
          className="w-96 mb-2"
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
        <Button
          text="Get social profiles"
          onClick={fetchProfiles}
          className="bg-green-500 mt-2 mb-4"
        />
      </div>
      {nfts?.map(({ tokenNfts }, index) => {
        const { contentValue, erc6551Accounts } = tokenNfts ?? {};
        const { addresses, socials, tokenBalances } =
          erc6551Accounts?.[0]?.address ?? [];
        return (
          <div key={index} className="flex flex-row p-2">
            <div
              style={{
                backgroundImage: `url(${
                  contentValue?.image?.original ?? "/fallback.png"
                })`,
                width: "150px",
                aspectRatio: "1/1",
                backgroundSize: "cover",
              }}
              className="basis-1/4"
            />
            <div className="basis-3/4 p-2">
              {addresses && Boolean(addresses?.length) && (
                <>
                  <p className="text-red-500 text-lg">TBA Addreses</p>
                  {addresses.map((addr) => (
                    <a
                      href={`https://etherscan.io/address/${addr}`}
                      target="_blank"
                      key={addr}
                    >
                      {addr}
                    </a>
                  ))}
                </>
              )}
              {socials && Boolean(socials?.length) && (
                <>
                  <p className="mt-4 text-blue-500 text-lg">Socials</p>
                  {socials.map((social) => (
                    <div key={social.profileName}>
                      <p>Protocol: {social.dappName}</p>
                      <p>Handle: {social.profileName}</p>
                    </div>
                  ))}
                </>
              )}
              {tokenBalances && Boolean(tokenBalances?.length) && (
                <>
                  <p className="mt-4 text-green-500 text-lg">Collectibles</p>
                  <div className="flex flex-row gap-3">
                    {tokenBalances.map(({ tokenNfts }, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundImage: `url(${
                            tokenNfts?.contentValue?.image?.original ??
                            "/fallback.png"
                          })`,
                          width: "50px",
                          aspectRatio: "1/1",
                          backgroundSize: "cover",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
      {loading && <Loading className="mt-4" />}
      {message && <p>{message}</p>}
    </div>
  );
}
