import React, { useState, useEffect, useCallback } from "react";
import { useWalletContext } from "../contexts/WalletContext";
import {
  CubeTransparentIcon,
  ClockIcon,
  UserIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { ContractEvent } from "../../types";
import * as blockchainService from "../services/blockchainService";
import * as userServices from "../services/userServices";
import Spinner from "../components/ui/Spinner";
import Tag from "../components/ui/Tag";

const ChainExplorerPage: React.FC = () => {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [userNids, setUserNIDs] = useState<Map<string, string>>(new Map());
  const [userRoles, setUserRoles] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [nid, setNid] = useState("");
  const { web3State } = useWalletContext();

  const fetchEvents = useCallback(async () => {
    if (!web3State.contract) return;
    setIsLoading(true);
    const fetchedEvents = await blockchainService.getContractEvents(
      web3State.contract
    );
    setEvents(fetchedEvents);

    const userMap = new Map<string, string>();
    const roleMap = new Map<string, string>();
    await Promise.all(
      fetchedEvents.map(async (event) => {
        if (event.from) {
          const user = await userServices.getUserByWallet(
            event.from.toLowerCase()
          );
          console.log(
            "Fetched user for wallet",
            event.from.toLowerCase(),
            user
          );
          const role = user?.userRole || "Unknown";
          const userNID = user?.nidNumber || "Unknown";
          userMap.set(event.from.toLowerCase(), userNID);
          roleMap.set(event.from.toLowerCase(), role);
        }
      })
    );
    setUserNIDs(userMap);
    setUserRoles(roleMap);
    setIsLoading(false);
  }, [web3State.contract]);

  useEffect(() => {
    if (!web3State.isLoading) {
      fetchEvents();
    }
  }, [web3State.isLoading, fetchEvents]);

  // Utility function to format time ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  // Utility function to format timestamp as readable date
  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getEventTagColor = (eventName: string) => {
    if (eventName.includes("Registered") || eventName.includes("Approved"))
      return "green";
    if (eventName.includes("Requested") || eventName.includes("Transferred"))
      return "blue";
    if (eventName.includes("Dispute")) return "red";
    return "gray";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8 mt-20">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-[#465465] mb-6">
                Chain Explorer
              </h1>
              <p className="text-xl text-[#293842] max-w-3xl mx-auto mb-8 leading-relaxed">
                A live feed of all significant events from the Land Registry
                smart contract with detailed timing and transaction information.
              </p>

              {/* Statistics and Refresh Button */}
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <div className="bg-white rounded-lg shadow-md border border-[#a1d99b] px-6 py-3">
                  <span className="text-2xl font-bold text-[#006d2c]">
                    {events.length}
                  </span>
                  <span className="text-sm text-[#293842] ml-2">
                    Total Events
                  </span>
                </div>

                <button
                  onClick={fetchEvents}
                  disabled={isLoading}
                  className="bg-[#41ab5d] hover:bg-[#006d2c] disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Spinner size="sm" className="text-white" />
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  )}
                  <span>Refresh</span>
                </button>

                {events.length > 0 && events[0]?.timestamp && (
                  <div className="bg-white rounded-lg shadow-md border border-[#a1d99b] px-6 py-3">
                    <span className="text-sm text-[#293842]">Latest: </span>
                    <span className="text-sm font-medium text-[#006d2c]">
                      {formatTimeAgo(events[0].timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#a1d99b] p-8 max-w-md mx-auto">
                  <Spinner size="lg" className="mx-auto mb-4 text-[#41ab5d]" />
                  <p className="text-lg text-[#293842]">
                    Loading on-chain events...
                  </p>
                </div>
              </div>
            ) : events.length > 0 ? (
              <div className="bg-white rounded-xl shadow-xl border-2 border-[#a1d99b] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#a1d99b]">
                    <thead className="bg-gradient-to-r from-blue-50 to-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        >
                          Transaction Hash
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        >
                          Block ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        >
                          Block Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        >
                          User Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#a1d99b]">
                      {events.map((event, index) => {
                        return (
                          <tr
                            key={index}
                            className="hover:bg-[#a1d99b]/10 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded max-w-fit">
                                {event.transactionHash
                                  ? `${event.transactionHash.substring(
                                      0,
                                      10
                                    )}...${event.transactionHash.substring(
                                      event.transactionHash.length - 8
                                    )}`
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Tag color={getEventTagColor(event.name)}>
                                {event.name}
                              </Tag>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className="font-mono text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded border border-gray-300">
                                  #{event.blockNumber}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-2">
                                {event.timestamp ? (
                                  <>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 font-semibold">
                                      <ClockIcon className="h-4 w-4 text-gray-400" />
                                      <span>
                                        {formatTimeAgo(event.timestamp)}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatDateTime(event.timestamp)}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-xs text-gray-400">
                                    Time unavailable
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2 text-xs">
                                  <UserIcon className="h-4 w-4 text-gray-400" />
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-600">
                                    {userNids.get(event.from.toLowerCase()) ||
                                      "System Contract"}
                                  </span>
                                </div>
                                <div className="text-xs"></div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2 text-xs">
                                  <IdentificationIcon className="h-4 w-4 text-gray-400" />
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-600">
                                    {userRoles.get(event.from.toLowerCase()) ||
                                      "System Contract"}
                                  </span>
                                </div>
                                <div className="text-xs"></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-[#a1d99b] max-w-2xl mx-auto">
                <CubeTransparentIcon className="mx-auto h-16 w-16 text-[#465465] mb-4" />
                <h3 className="text-2xl font-semibold text-[#006d2c] mb-2">
                  No Events Found
                </h3>
                <p className="text-[#293842]">
                  There are no historical events for this contract, or they
                  could not be fetched.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChainExplorerPage;
