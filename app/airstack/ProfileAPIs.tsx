"use client";
import { useState } from "react";
import { getSocials } from "../../api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const URI = "https://api.airstack.xyz/gql";

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});

export function ProfileAPIs() {
  const [domains, setDomains] = useState<any>([]);
  const [socials, setSocials] = useState<any>([]);
  const [isXMTPEnabled, setIsXMTPEnabled] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<any>([]); // List of address attach to `address` state (input)
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function fetchProfiles() {
    if (!address) return;
    try {
      setLoading(true);
      setMessage("");
      setDomains([]);
      setSocials([]);
      const response = await client.query({
        query: getSocials,
        variables: {
          address,
        },
        context: {
          headers: {
            authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || "",
          },
        },
      });
      const { Wallet } = response.data;
      if (Wallet.addresses) {
        setAddresses(Wallet.addresses);
      }
      if (Wallet.domains) {
        setDomains(Wallet.domains);
      }
      if (Wallet.socials) {
        setSocials(Wallet.socials);
      }
      if (Wallet?.xmtp?.[0]?.isXMTPEnabled) {
        setIsXMTPEnabled(Wallet?.xmtp?.[0]?.isXMTPEnabled);
      }
      if (
        !Wallet.domains &&
        !Wallet.socials &&
        !Wallet?.xmtp?.[0]?.isXMTPEnabled
      ) {
        setMessage("No profiles for this address.");
      }
      setLoading(false);
    } catch (err) {
      console.log("error fetching profiles ...", err);
      setLoading(false);
    }
  }
  return (
    <div className="mt-4">
      <p className="font-bold mt-4 mb-4">Resolving Social Profiles</p>
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
      {Boolean(addresses.length) && (
        <>
          <p className="text-red-500 text-lg">Addreses</p>
          {addresses.map((addr) => (
            <p key={addr}>{addr}</p>
          ))}
        </>
      )}
      {Boolean(domains.length) && (
        <>
          <p className="mt-4 text-green-500 text-lg">Domains</p>
          {domains.map((domain) => (
            <p key={domain.name}>{domain.name}</p>
          ))}
        </>
      )}
      {Boolean(socials.length) && (
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
      {isXMTPEnabled && (
        <>
          <p className="mt-4 text-purple-500 text-lg">XMTP</p>
          <p>{isXMTPEnabled ? "Enabled" : "Disabled"}</p>
        </>
      )}
      {loading && <Loading className="mt-4" />}
      {message && <p>{message}</p>}
    </div>
  );
}
