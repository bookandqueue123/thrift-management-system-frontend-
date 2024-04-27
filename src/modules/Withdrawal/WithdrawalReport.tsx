import DummyTransactions from "@/api/dummyTransactions.json";
import { useAuth } from "@/api/hooks/useAuth";
import { FilterDropdown } from "@/components/Buttons";
import PaginationBar from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import TransactionsTable from "@/components/Tables";
import { selectUserId } from "@/slices/OrganizationIdSlice";
import { WithdrawalProps } from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function WithdrawalReport() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [withdrawalId, setWithdrawalId] = useState("");

  const [withdrawalData, setWithdrawalData] = useState<WithdrawalProps[]>([]);
  const userId = useSelector(selectUserId);
  const router = useRouter();
  const [paymentConfirmation, setpaymentConfirmation] = useState("");

  const { client } = useAuth();

  const handleUploadBtnClick = (withdrawalId: string) => {
    setIsModalOpen(true);
    setWithdrawalId(withdrawalId);
  };
  const handleImageChange = (event: { target: { files: FileList | null } }) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedImage(file);
    }
  };

  const handleSubmit = () => {
    // Logic to handle image submission

    setIsModalOpen(false);
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }
    uploadReceipt();
  };

  const { mutate: uploadReceipt } = useMutation({
    mutationKey: ["upload receipt"],
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("paymentEvidence", selectedImage);

      // Send the file to the backend
      return client.put(`/api/withdrawal/${withdrawalId}`, formData);
    },
    onSuccess(response: AxiosResponse<any>) {
      alert("Receipt submitted successfully!");

      // router.push('/merchant/settings/withdrawals')
    },
    onError(error: AxiosError<any, any>) {
      console.log("error");
    },
  });

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return; // If no file is selected, do nothing
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     // Send the file to the backend
  //     const response = await axios.post('/api/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log('File uploaded:', response.data);
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

  const { mutate: UpdateCofirmationStatus } = useMutation({
    mutationFn: async (updatedConfirmationPaymentRow: WithdrawalProps) => {
      return client.put(
        `/api/withdrawal/${updatedConfirmationPaymentRow._id}`,
        {
          paymentConfirmation:
            updatedConfirmationPaymentRow.paymentConfirmation,
          // status: "paid"
        },
      );
    },
    onSuccess(response: AxiosResponse<any>) {
      // router.push('/merchant/settings/withdrawals')
      router.refresh();
    },
    onError(error: AxiosError<any, any>) {},
  });

  const {
    data: withdrawals,
    isLoading: isWithdrawalLoading,
    isError: withDrawerError,
  } = useQuery({
    queryKey: ["allWithdrawals", withdrawalData],
    queryFn: async () => {
      return client
        .get(`/api/withdrawal?user=${userId}`, {})
        .then((response) => {
          setWithdrawalData(response.data);
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  const handleStatus = (index: number) => {
    const newData = [...withdrawalData];

    newData[index].paymentConfirmation =
      newData[index].paymentConfirmation === "unconfirmed"
        ? "confirmed"
        : "unconfirmed";

    setWithdrawalData(newData);

    // updateStatus(newData[index])
    UpdateCofirmationStatus(newData[index]);
  };

  return (
    <div className="mt-16">
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="items-center gap-3 md:flex">
            <p className="text-white">Withdrawal Report</p>
          </span>
          <span className="flex items-center gap-3">
            <FilterDropdown
              options={[
                "Customer Account",
                "Saving Purpose",
                "Transaction Date & Time",
                "Amount",
                "Narration",
                "Reference ID",
                "Status",
                "Payment Confirmation ",
                "Withdrawer Request",
                "Evidence of payment",
              ]}
            />
          </span>
        </div>

        <div>
          {withdrawals && (
            <TransactionsTable
              headers={[
                "Customer Account",
                "Saving Purpose",
                "Transaction Date & Time",
                "Amount",
                "Narration",
                "Reference ID",
                "Status",
                "Payment Confirmation",
                // "Withdrawal Request",
                "Upload Evidence of Receipt",
              ]}
              content={withdrawals?.map(
                (withdrawal: WithdrawalProps, index: number) => (
                  <tr className="" key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {withdrawal.user && withdrawal.user.accountNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {withdrawal.saving && withdrawal.saving.purposeName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {withdrawal.updatedAt
                        ? new Date(withdrawal.updatedAt).toLocaleDateString()
                        : "Invalid Date"}{" "}
                      {withdrawal.updatedAt
                        ? new Date(withdrawal.updatedAt).toLocaleTimeString()
                        : "Invalid Date"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {AmountFormatter(Number(withdrawal.amount))} NGN
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm"></td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {withdrawal._id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={withdrawal.status} />
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {/* <Badge status={withdrawal.paymentConfirmation} onClick={() => console.log(12)}/> */}
                      <div className="">
                        <button
                          style={{
                            borderRadius: "5px",
                            padding: "4px",
                            backgroundColor:
                              withdrawal.paymentConfirmation === "confirmed"
                                ? "green"
                                : "#FF535B",
                            color:
                              withdrawal.paymentConfirmation === "confirmed"
                                ? "white"
                                : "white",
                          }}
                          onClick={() => handleStatus(index)}
                        >
                          {withdrawal.paymentConfirmation === "confirmed"
                            ? "Confirmed"
                            : "Unconfirmed"}
                        </button>
                      </div>
                    </td>

                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                
                <Badge status={withdrawal.withdrawalRequest} onClick={(() => "")}/>
                </td> */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <label className="flex cursor-pointer items-center rounded bg-[#F2F2F2] px-4 py-2 font-bold text-[#090E2C] hover:bg-white">
                        {/* <span className="ml-4 mr-4">
                  <FiUpload/>
                </span>
                
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    //  onChange={() => (UpdateWithdrawalConfirmation(withdrawal))}
                    accept="image/*,.pdf,.doc,.docx,.txt" // Accept images and common document formats
                  /> */}

                        <button
                          className="  rounded  font-bold"
                          onClick={() => handleUploadBtnClick(withdrawal._id)}
                        >
                          Upload Evidence
                        </button>
                      </label>
                    </td>
                  </tr>
                ),
              )}
            />
          )}
          {/* Modal */}

          {isModalOpen && (
            <div className="bg-dark fixed inset-0 z-10 overflow-y-auto text-white">
              <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:h-screen sm:align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="bg-dark px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3
                          className="text-lg font-medium leading-6 text-gray-900"
                          id="modal-headline"
                        >
                          Upload Evidence
                        </h3>
                        <div className="mt-5">
                          <input
                            type="file"
                            onChange={handleImageChange}
                            className="mt-2"
                            accept="image/*"
                          />
                          {selectedImage && (
                            <Image
                              width={500}
                              height={500}
                              src={URL.createObjectURL(selectedImage)}
                              alt="Selected"
                              className="mx-auto mt-4"
                              style={{ maxWidth: "200px" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* <PaginationBar apiResponse={DummyTransactions} /> */}
        </div>
      </section>
    </div>
  );
}
