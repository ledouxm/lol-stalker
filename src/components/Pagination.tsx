import { ButtonHTMLAttributes } from "react";
import cx from "classnames";
import { WithChildren, WithClassName } from "@pastable/core";
import { Box, Button, ButtonProps, Flex } from "@chakra-ui/react";

/**
 * Pagination with siblingsNbToShow = 2 looks like that
 * [1] 2 3 ... 200
 * 1 [2] 3 4 ... 200

 * 1 2 [3] 4 5 ... 200
 * 1 2 3 [4] 5 6 ... 200

 * 1 ... 3 4 [5] 6 7 ... 200
 * 1 ... 4 5 [6] 7 8... 200
 */
export const Pagination = ({
    goToPage,
    pageIndex,
    pageCount,
    siblingsNbToShow = 2,
}: {
    goToPage: (page: number) => void;
    pageIndex: number;
    pageCount: number;
    siblingsNbToShow?: number;
}) => {
    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount;

    const goToFirst = () => goToPage(0);
    const willGoTo = (page: number) => () => goToPage(page);
    const goToLast = () => goToPage(pageCount - 1);

    const distanceToFirst = Math.abs(0 - pageIndex);
    const distanceToLast = Math.abs(pageCount - pageIndex);

    const canShowFirst = pageIndex > 0;
    const canShowLast = pageIndex < pageCount && distanceToLast >= siblingsNbToShow;

    const current = pageIndex + 1;
    const makeSiblings = (operation = 1) =>
        Array(siblingsNbToShow)
            .fill(0)
            .map((_value, index) => operation * index + current + operation)
            .filter((value) => value > 1 && value < pageCount);
    const siblingsBefore = makeSiblings(-1).reverse();
    const siblingsAfter = makeSiblings(1);

    return (
        <>
            <Flex>
                {canShowFirst && (
                    <>
                        <PaginationButton onClick={goToFirst} disabled={!canPreviousPage}>
                            1
                        </PaginationButton>
                        {distanceToFirst > siblingsNbToShow + 1 && (
                            <PaginationButton disabled>...</PaginationButton>
                        )}
                    </>
                )}
                {siblingsBefore.map((value) => (
                    <PaginationButton
                        key={value}
                        onClick={willGoTo(value - 1)}
                        disabled={!canPreviousPage}
                    >
                        {value}
                    </PaginationButton>
                ))}
                <PaginationButton className="active" disabled>
                    {current}
                </PaginationButton>
                {siblingsAfter.map((value) => (
                    <PaginationButton
                        key={value}
                        onClick={willGoTo(value - 1)}
                        disabled={!canNextPage}
                    >
                        {value}
                    </PaginationButton>
                ))}
                {canShowLast && (
                    <>
                        {distanceToLast > siblingsNbToShow + 2 && <Box p="5px">···</Box>}
                        <PaginationButton onClick={goToLast} disabled={!canNextPage}>
                            {pageCount}
                        </PaginationButton>
                    </>
                )}
            </Flex>
        </>
    );
};

const PaginationButton = ({ children, ...props }: WithClassName & WithChildren & ButtonProps) => {
    return (
        <Button h="initial" w="initial" minW="initial" p="8px" {...props}>
            {children}
        </Button>
    );
};
