"use client";
import React, { useState } from "react";
import {
  useGlobalContext,
  useGlobalContextUpdate,
} from "@/app/context/globalContext";
import { commandIcon } from "@/app/utils/Icons";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {Search} from "lucide-react";

function SearchDialog() {
  const { geoCodedList, inputValue, handleInput } = useGlobalContext();
  const { setActiveCityCoords } = useGlobalContextUpdate();

  const [hoveredIndex, setHoveredIndex] = React.useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const getClickedCoords = (lat: number, lon: number) => {
    setActiveCityCoords([lat, lon]);
    setOpen(false);
  };

  return (
      <div className="search-btn">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
                variant="outline"
                className="border inline-flex items-center justify-center text-sm font-medium hover:dark:bg-[#131313] hover:bg-slate-100  ease-in-out duration:200 w-full"
                onClick={() => setOpen(true)}
            >
              <Search className="flex w-5 h-5 mr-2 ml-[-10px] text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Введите город</p>
            </Button>
          </DialogTrigger>

          <DialogContent className="p-0">
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                  value={inputValue}
                  onChangeCapture={handleInput}
                  placeholder="Type a command or search..."
              />
              <ul className="px-3 pb-2">
                <p className="p-2 text-sm text-muted-foreground">Suggestions</p>

                {geoCodedList?.length === 0 || (!geoCodedList && <p>No Results</p>)}

                {geoCodedList &&
                    geoCodedList.map(
                        (
                            item: {
                              name: string;
                              country: string;
                              state: string;
                              lat: number;
                              lon: number;
                            },
                            index: number
                        ) => {
                          const { country, state, name } = item;
                          return (
                              <li
                                  key={index}
                                  onMouseEnter={() => setHoveredIndex(index)}
                                  className={`py-3 px-2 text-sm rounded-sm cursor-default ${
                                      hoveredIndex === index ? "bg-accent" : ""
                                  }`}
                                  onClick={() => {
                                    getClickedCoords(item.lat, item.lon);
                                  }}
                              >
                                <p className="text">
                                  {name}, {state && state + ","} {country}
                                </p>
                              </li>
                          );
                        }
                    )}
              </ul>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
  );
}

export default SearchDialog;
