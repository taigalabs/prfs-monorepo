import React from "react";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table2, {
  Table2Body,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table2/Table2";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";

import styles from "./ProofTypeTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { ProofTypeItem } from "../create_proof_form/CreateProofForm";

const ProofTypeTable: React.FC<ProofTypeTableProps> = ({ handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<PrfsProofType[]>([]);

  const handleClickExternalLink = React.useCallback((ev: React.MouseEvent, url: string) => {
    ev.stopPropagation();
    window.open(url, "_blank");
  }, []);

  const columns = React.useMemo(() => {
    const cols: ColumnDef<PrfsProofType>[] = [
      {
        id: "img_url",
        accessorFn: row => row.img_url,
        cell: info => {
          const img_url = info.getValue() as string;

          return (
            <div className={styles.imgCol}>
              <CaptionedImg img_url={img_url} size={50} />
            </div>
          );
        },
      },
      {
        id: "label",
        accessorFn: row => ({
          label: row.label,
          proof_type_id: row.proof_type_id,
        }),
        cell: info => {
          const { label, proof_type_id } = info.getValue() as {
            label: string;
            proof_type_id: string;
          };

          const url = `${process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_types/${proof_type_id}`;

          return (
            <div>
              <div className={styles.label}>
                <p>{label}</p>
                <div className={styles.icon}>
                  <div onClick={ev => handleClickExternalLink(ev, url)}>
                    <BiLinkExternal />
                  </div>
                </div>
              </div>
              <p className={styles.proofTypeId}>{proof_type_id}</p>
            </div>
          );
        },
      },
      {
        id: "proof_type_id",
        accessorFn: row => row.proof_type_id,
        cell: info => info.getValue(),
      },
    ];

    return cols;
  }, [i18n]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_proof_types", {
        page_idx: pageIndex,
        page_size: pageSize,
      });

      setData(payload.prfs_proof_types);
    }

    fn().then();
  }, [setData, pageIndex, pageSize]);

  const pagination = React.useMemo(() => {
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: {
        proof_type_id: false,
      },
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className={styles.wrapper}>
      <TableSearch>
        <input placeholder={i18n.proof_type_search_guide} />
      </TableSearch>
      <Table2>
        <Table2Body>
          {table.getRowModel().rows.map(row => {
            const proofTypeId = row.getValue("proof_type_id") as string;
            const imgUrl = row.getValue("img_url") as string | null;

            // Synthetic data type
            const label = row.getValue("label") as {
              label: string;
              proof_type_id: string;
            };

            return (
              <tr
                key={row.id}
                onClick={() => handleSelectVal({ proofTypeId, label: label.label, imgUrl })}
              >
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </Table2Body>
      </Table2>
    </div>
  );
};

export default ProofTypeTable;

export interface ProofTypeTableProps {
  handleSelectVal: (proofTypeItem: ProofTypeItem) => void;
}
