"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

export function AutocompleteInput({ name, placeholder, options = [], icon, value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || "")
  const [filteredOptions, setFilteredOptions] = useState(options)
  const wrapperRef = useRef(null)

  useEffect(() => {
    setInputValue(value || "")
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)

    // Filter options based on input
    const filtered = options.filter((option) => option.toLowerCase().includes(newValue.toLowerCase()))
    setFilteredOptions(filtered)
    setIsOpen(true)
  }

  const handleOptionClick = (option) => {
    setInputValue(option)
    onChange?.(option)
    setIsOpen(false)
  }

  const handleFocus = () => {
    setFilteredOptions(options)
    setIsOpen(true)
  }

  return (
    <div ref={wrapperRef} className="relative flex-1">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground">{icon}</div>}
      <Input
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        className={`${icon ? "pl-10" : ""} h-12 bg-background border-border ${className}`}
        autoComplete="off"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
