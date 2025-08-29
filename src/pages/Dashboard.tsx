import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  Shield,
  Activity,
  Home,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import { Property, TransferRequest, ContractEvent } from "../../types";
import * as blockchainService from "../services/blockchainService";
import Spinner from "../components/ui/Spinner";
import { ethers } from "ethers";

const Dashboard = () => {
  const { user, walletAddress, web3State } = useWalletContext();
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<ContractEvent[]>(
    []
  );
  const [userStats, setUserStats] = useState({
    totalProperties: 0,
    portfolioValue: "0 ETH",
    activeTransactions: 0,
    walletBalance: "0 ETH",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!web3State.contract || !walletAddress) return;

      setIsLoading(true);
      try {
        // Fetch user's properties
        const properties = await blockchainService.getPropertiesByOwner(
          web3State.contract,
          walletAddress
        );
        setUserProperties(properties);

        // Fetch recent contract events (for transaction history)
        const events = await blockchainService.getContractEvents(
          web3State.contract
        );
        // Filter events related to current user
        const userEvents = events
          .filter(
            (event) =>
              event.from?.toLowerCase() === walletAddress?.toLowerCase()
          )
          .slice(0, 5); // Get last 5 events
        setRecentTransactions(userEvents);

        // Calculate portfolio value
        const totalValue = properties.reduce((sum, property) => {
          return sum + Number(property.marketValue);
        }, 0);

        // Get wallet balance
        let balance = "0 ETH";
        if (web3State.provider && walletAddress) {
          try {
            const balanceWei = await web3State.provider.getBalance(
              walletAddress
            );
            const balanceEth = ethers.formatEther(balanceWei);
            balance = `${parseFloat(balanceEth).toFixed(3)} ETH`;
          } catch (error) {
            console.error("Error fetching balance:", error);
          }
        }

        // Count active transactions (transfer requests)
        const transferRequests = await blockchainService.getAllTransferRequests(
          web3State.contract
        );
        const activeRequests = transferRequests.filter(
          (req) =>
            (req.seller.toLowerCase() === walletAddress?.toLowerCase() ||
              req.buyer.toLowerCase() === walletAddress?.toLowerCase()) &&
            !req.completed
        );

        setUserStats({
          totalProperties: properties.length,
          portfolioValue:
            totalValue > 0 ? `${(totalValue / 1e18).toFixed(3)} ETH` : "0 ETH",
          activeTransactions: activeRequests.length,
          walletBalance: balance,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!web3State.isLoading) {
      fetchUserData();
    }
  }, [web3State.contract, web3State.isLoading, walletAddress]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: "#465465" }}
              >
                Property Portfolio Dashboard
              </h1>
              <p className="text-lg text-gray-700">
                Manage your blockchain-verified properties and track
                transactions
              </p>
              {user && (
                <div
                  className="mt-4 p-4 rounded-lg border"
                  style={{ borderColor: "#a1d99b", backgroundColor: "#f7fcf5" }}
                >
                  <p className="text-2xl font-bold text-gray-700">
                    Welcome back,{" "}
                    <span
                      className="font-extrabold"
                      style={{ color: "#2563eb" }}
                    >
                      {user.fullName}
                    </span>
                  </p>
                  <p className="text-lg mt-2 font-semibold text-gray-600">
                    Wallet: {walletAddress?.slice(0, 6)}...
                    {walletAddress?.slice(-4)}
                  </p>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <Spinner size="lg" className="mx-auto mb-4 text-gray-500" />
                <p className="text-lg text-gray-700">
                  Loading your dashboard...
                </p>
              </div>
            ) : (
              <>
                <div className="grid lg:grid-cols-4 gap-6 mb-8">
                  <Card className="border" style={{ borderColor: "#a1d99b" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle
                        className="text-sm font-medium"
                        style={{ color: "#465465" }}
                      >
                        Total Properties
                      </CardTitle>
                      <Shield
                        className="h-4 w-4"
                        style={{ color: "#41ab5d" }}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-800">
                        {userStats.totalProperties}
                      </div>
                      <p className="text-xs text-gray-500">
                        Blockchain verified
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border" style={{ borderColor: "#a1d99b" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle
                        className="text-sm font-medium"
                        style={{ color: "#465465" }}
                      >
                        Portfolio Value
                      </CardTitle>
                      <TrendingUp
                        className="h-4 w-4"
                        style={{ color: "#41ab5d" }}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-800">
                        {userStats.portfolioValue}
                      </div>
                      <p className="text-xs text-gray-500">Market estimation</p>
                    </CardContent>
                  </Card>

                  <Card className="border" style={{ borderColor: "#a1d99b" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle
                        className="text-sm font-medium"
                        style={{ color: "#465465" }}
                      >
                        Active Transactions
                      </CardTitle>
                      <Activity
                        className="h-4 w-4"
                        style={{ color: "#293842" }}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-800">
                        {userStats.activeTransactions}
                      </div>
                      <p className="text-xs text-gray-500">Pending approvals</p>
                    </CardContent>
                  </Card>

                  <Card className="border" style={{ borderColor: "#a1d99b" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle
                        className="text-sm font-medium"
                        style={{ color: "#465465" }}
                      >
                        Wallet Balance
                      </CardTitle>
                      <Wallet
                        className="h-4 w-4"
                        style={{ color: "#41ab5d" }}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-800">
                        {userStats.walletBalance}
                      </div>
                      <p className="text-xs text-gray-500">
                        Available for transactions
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="border" style={{ borderColor: "#a1d99b" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "#465465" }}>
                        Your Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProperties.length > 0 ? (
                          userProperties.slice(0, 3).map((property) => (
                            <div
                              key={property.id}
                              className="flex items-center space-x-4 p-4 border rounded-lg"
                              style={{ borderColor: "#a1d99b" }}
                            >
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50">
                                <Home
                                  className="w-6 h-6"
                                  style={{ color: "#41ab5d" }}
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">
                                  Property #{property.id}
                                </h4>
                                <div className="flex items-center mt-1">
                                  <MapPin
                                    className="w-3 h-3 mr-1"
                                    style={{ color: "#465465" }}
                                  />
                                  <p className="text-sm text-gray-600">
                                    {property.location}
                                  </p>
                                </div>
                                <p className="text-xs mt-1 text-gray-500">
                                  {property.area.toLocaleString()} sq ft •{" "}
                                  {(
                                    Number(property.marketValue) / 1e18
                                  ).toFixed(3)}{" "}
                                  ETH
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge
                                  className="text-xs"
                                  style={{
                                    backgroundColor: property.hasDispute
                                      ? "#fef2f2"
                                      : "#dcfce7",
                                    color: property.hasDispute
                                      ? "#dc2626"
                                      : "#166534",
                                  }}
                                >
                                  {property.hasDispute ? "Dispute" : "Verified"}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: "#a1d99b",
                                    color: "#41ab5d",
                                  }}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Home
                              className="w-12 h-12 mx-auto mb-4"
                              style={{ color: "#a1d99b" }}
                            />
                            <p>No properties found</p>
                            <p className="text-xs mt-1">
                              Register your first property to get started
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border" style={{ borderColor: "#a1d99b" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "#465465" }}>
                        Recent Transactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentTransactions.length > 0 ? (
                          recentTransactions.map((event, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 border rounded-lg"
                              style={{ borderColor: "#a1d99b" }}
                            >
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {event.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Block #{event.blockNumber}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Calendar
                                    className="w-3 h-3 mr-1"
                                    style={{ color: "#465465" }}
                                  />
                                  <p className="text-xs text-gray-500">
                                    {event.timestamp
                                      ? formatTimeAgo(event.timestamp)
                                      : "Unknown time"}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                style={{
                                  borderColor: "#41ab5d",
                                  color: "#41ab5d",
                                }}
                              >
                                Confirmed
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Activity
                              className="w-12 h-12 mx-auto mb-4"
                              style={{ color: "#a1d99b" }}
                            />
                            <p>No recent transactions</p>
                            <p className="text-xs mt-1">
                              Your transaction history will appear here
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
