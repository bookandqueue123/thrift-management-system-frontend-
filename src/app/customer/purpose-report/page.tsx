// "use client";
// import { useAuth } from "@/api/hooks/useAuth";
// import useRedirect from "@/api/hooks/useRedirect";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import TransactionsTable from "@/components/Tables";
// import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
// import AmountFormatter from "@/utils/AmountFormatter";
// import { extractDate, extractTime } from "@/utils/TimeStampFormatter";
// import { useQuery } from "@tanstack/react-query";
// import {
//   JSXElementConstructor,
//    PromiseLikeOfReactNode,
//   ReactElement,
//   ReactNode,
//   ReactPortal,
// } from "react";
// import { useSelector } from "react-redux";

// export default function PurposeReport() {
//   useRedirect();
//   const { client } = useAuth();
//   const organisationId = useSelector(selectOrganizationId);

//   const { data: allPurpose } = useQuery({
//     queryKey: ["allPurpose"],
//     staleTime: 5000,
//     queryFn: async () => {
//       return client
//         .get(`/api/purpose/payment/item`)
//         .then((response) => response.data)
//         .catch((error) => {
//           throw error;
//         });
//     },
//   });

//   return (
//     <ProtectedRoute requirePurpose>
//       <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
//         <div className="mb-4 space-y-2">
//           <div className="mt-8">
//             <TransactionsTable
//               headers={[
//                 "S/N",
//                 "Item/Purpose",
//                 "Category",
//                 "Amount",
//                 "Quantity",
//                 "Total",
//                 "Balance",
//                 "Total Payment Duration",
//                 "Days Left",
//                 "Payment Completion %",
//                 "Transaction reference",
//                 "Time and date of transaction",
//                 "Payment gateway",
//                 "Payment status",
//               ]}
//               content={
//                 <>
//                   {allPurpose &&
//                     allPurpose.map(
//                       (
//                         payment: {
//                           name:
//                             | string
//                             | number
//                             | boolean
//                             | ReactElement<
//                                 any,
//                                 string | JSXElementConstructor<any>
//                               >
//                             | Iterable<ReactNode>
//                             | ReactPortal
//                          | PromiseLikeOfReactNode
//                             | null
//                             | undefined;
//                           category:
//                             | string
//                             | number
//                             | boolean
//                             | ReactElement<
//                                 any,
//                                 string | JSXElementConstructor<any>
//                               >
//                             | Iterable<ReactNode>
//                             | ReactPortal
//                             | PromiseLikeOfReactNode
//                             | null
//                             | undefined;
//                           amount: number;
//                           quantity:
//                             | string
//                             | number
//                             | boolean
//                             | ReactElement<
//                                 any,
//                                 string | JSXElementConstructor<any>
//                               >
//                             | Iterable<ReactNode>
//                             | ReactPortal
//                             | PromiseLikeOfReactNode
//                             | null
//                             | undefined;
//                           total:
//                             | string
//                             | number
//                             | boolean
//                             | ReactElement<
//                                 any,
//                                 string | JSXElementConstructor<any>
//                               >
//                             | Iterable<ReactNode>
//                             | ReactPortal
//                             | PromiseLikeOfReactNode
//                             | null
//                             | undefined;
//                           balance:
//                             | string
//                             | number
//                             | boolean
//                             | ReactElement<
//                                 any,
//                                 string | JSXElementConstructor<any>
//                               >
//                             | Iterable<ReactNode>
//                             | ReactPortal
//                             | PromiseLikeOfReactNode
//                             | null
//                             | undefined;
//                           TotalPaymentDuration: any;
//                           DaysLeft: any;
//                           paymentCompletionPercentage: any;
//                           transactionReference: any;
//                           timeAndDate: string | Date;
//                           PaymentGateway: any;
//                         },
//                         index: number,
//                       ) => (
//                         <tr key={index}>
//                           <td className="whitespace-nowrap px-6 py-4 text-sm">
//                             {index + 1}
//                           </td>
//                           <td className="whitespace-nowrap px-6 py-4 text-sm ">
//                             {payment.name}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.category}
//                           </td>
//                           <td className="whitespace-nowrap px-6 py-4 text-sm ">
//                             {AmountFormatter(payment.amount)}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.quantity}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.total}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.balance}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.TotalPaymentDuration || "NULL"}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.DaysLeft || "NULL"}{" "}
//                             {payment.DaysLeft ? "days left" : ""}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.paymentCompletionPercentage || "NULL"}{" "}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.transactionReference || "NULL"}{" "}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {extractDate(payment.timeAndDate)}{" "}
//                             {extractTime(payment.timeAndDate) || "NULL"}{" "}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             {payment.PaymentGateway || "NULL"}{" "}
//                           </td>
//                           <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
//                             Success{" "}
//                           </td>
//                         </tr>
//                       ),
//                     )}
//                 </>
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

"use client";
import { useAuth } from "@/api/hooks/useAuth";
import useRedirect from "@/api/hooks/useRedirect";
import ProtectedRoute from "@/components/ProtectedRoute";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import AmountFormatter from "@/utils/AmountFormatter";
import { extractDate, extractTime } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useSelector } from "react-redux";

export default function PurposeReport() {
  useRedirect();
  const { client } = useAuth();
  const organisationId = useSelector(selectOrganizationId);

  const { data: allPurpose } = useQuery({
    queryKey: ["allPurpose"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/purpose/payment/item`)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        });
    },
  });

  return (
    <ProtectedRoute requirePurpose>
      <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
        <div className="mb-4 space-y-2">
          <div className="mt-8">
            <TransactionsTable
              headers={[
                "S/N",
                "Item/Purpose",
                "Category",
                "Amount",
                "Quantity",
                "Total",
                "Balance",
                "Total Payment Duration",
                "Days Left",
                "Payment Completion %",
                "Transaction reference",
                "Time and date of transaction",
                "Payment gateway",
                "Payment status",
              ]}
              content={
                <>
                  {allPurpose &&
                    allPurpose.map(
                      (
                        payment: {
                          name:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | null
                            | undefined;
                          category:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                           
                            | null
                            | undefined;
                          amount: number;
                          quantity:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                           
                            | null
                            | undefined;
                          total:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            
                            | null
                            | undefined;
                          balance:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            
                            | null
                            | undefined;
                          TotalPaymentDuration: any;
                          DaysLeft: any;
                          paymentCompletionPercentage: any;
                          transactionReference: any;
                          timeAndDate: string | Date;
                          PaymentGateway: any;
                        },
                        index: number,
                      ) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm ">
                            {payment.name}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.category}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm ">
                            {AmountFormatter(payment.amount)}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.quantity}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.total}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.balance}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.TotalPaymentDuration || "NULL"}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.DaysLeft || "NULL"}{" "}
                            {payment.DaysLeft ? "days left" : ""}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.paymentCompletionPercentage || "NULL"}{" "}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.transactionReference || "NULL"}{" "}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {extractDate(payment.timeAndDate)}{" "}
                            {extractTime(payment.timeAndDate) || "NULL"}{" "}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            {payment.PaymentGateway || "NULL"}{" "}
                          </td>
                          <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                            Success{" "}
                          </td>
                        </tr>
                      ),
                    )}
                </>
              }
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
