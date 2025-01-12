import { Box } from "components/Box/Box";
import { Button } from "components/Button/Button";
import { Select } from "components/Select/Select";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BillFiltersDesktop } from "./BillFiltersDesktop";
import styles from "./BillSearchAndFilters.module.scss";

export function BillSearchAndFilters() {
  const router = useRouter();
  const { query } = router;
  const { search, showFilters = "false", state } = query;
  const [searchValue, setSearchValue] = useState(search);
  const hasFiltersApplied =
    Object.keys(query).filter((q) => q !== "showFilters" && q !== "slug")
      .length > 0 && Object.values(query).some((value) => value !== "");

  const showFiltersParam = showFilters === "true";

  return (
    <Box>
      <div className={styles.flex}>
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Search for legislation"
            onChange={(e) => {
              setSearchValue(e.target.value);
              void router.push({
                query: { ...query, search: e.target.value },
              });
            }}
            value={searchValue || ""}
          ></input>
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
        <Select
          border="solid"
          accentColor="yellow"
          value={state as string}
          options={[
            { value: "CO", label: "Colorado" },
            { value: "MN", label: "Minnesota" },
          ]}
          onChange={(e) => {
            void router.push({
              query: { ...query, state: e.target.value },
            });
          }}
        />
        <Button
          variant={
            showFiltersParam || hasFiltersApplied ? "primary" : "secondary"
          }
          theme="yellow"
          label="Filters"
          size="medium"
          onClick={() =>
            router.push({
              query: {
                ...query,
                showFilters: showFiltersParam ? false : true,
              },
            })
          }
        />
        <Button
          variant="secondary"
          theme={"yellow"}
          disabled={!hasFiltersApplied}
          label="Clear"
          size="medium"
          onClick={() => {
            setSearchValue("");
            void router.replace(
              {
                pathname: router.pathname,
                query: router.query.slug ? { slug: router.query.slug } : null,
              },
              undefined,
              { shallow: true }
            );
          }}
        />
      </div>
      {showFiltersParam && <BillFiltersDesktop />}
    </Box>
  );
}
