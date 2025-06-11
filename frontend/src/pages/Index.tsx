import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shirt, Palette, Star, X } from "lucide-react";
import { StyleRecommendations } from "@/components/StyleRecommendations";
import { fetchRecommendations } from "@/utils/api";
import { Spinner } from "@/components/ui/Spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Index = () => {
  const [clothingItem, setClothingItem] = useState("");
  const [color, setColor] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [currentStyleInput, setCurrentStyleInput] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState<"men" | "women">("men");

  const handleStyleAdd = () => {
    const styleToAdd = currentStyleInput.trim();
    if (styleToAdd && !selectedStyles.includes(styleToAdd)) {
      setSelectedStyles([...selectedStyles, styleToAdd]);
      setCurrentStyleInput("");
    }
  };

  const handleStyleRemove = (styleToRemove: string) => {
    setSelectedStyles(selectedStyles.filter((s) => s !== styleToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clothingItem.trim()) return;
    setIsLoading(true);
    try {
      const results = await fetchRecommendations(clothingItem, color, selectedStyles, gender);
      setRecommendations(results);
    } catch (error) {
      alert("Failed to get recommendations from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const colors = ["red", "blue", "green", "yellow", "black", "white", "beige", "navy", "purple", "pink", "olive green", "gray", "brown", "cream", "khaki", "silver", "burgundy", "camel", "denim", "tan", "light blue", "dark wash"];
  const categories = ["t-shirt", "sneakers", "pants", "polo shirt", "jeans", "shirt", "blouse", "hoodie", "sweater", "pullover", "top", "jacket", "blazer", "trousers", "shorts", "skirt", "leggings", "culottes", "shoes", "boots", "sandals", "loafers", "heels", "flats", "dress"];
  const styles = ["elegant", "sportive", "casual", "smart", "street", "business casual", "professional", "date night", "edgy casual", "smart casual", "business formal", "sophisticated casual", "feminine casual", "relaxed casual", "cozy smart casual", "chic Parisian", "urban chic", "street style"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shirt className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Fashion Stylist</h1>
          </div>
          <p className="text-lg text-gray-600">
            Describe your clothing item and get personalized outfit recommendations
          </p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Get Your Style Recommendations
            </CardTitle>
            <CardDescription>
              For example: "shirt" in "red" or "jeans" for a "casual" look.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Gender</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value as "men" | "women")}
                  className="flex gap-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="men" id="men" />
                    <Label htmlFor="men">Men</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="women" id="women" />
                    <Label htmlFor="women">Women</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="color">Specific Color (e.g., red)</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., red"
                  className="mt-1"
                  list="colors"
                />
                <datalist id="colors">
                  {colors.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label htmlFor="clothing-item">Clothing Item (e.g., shirt)</Label>
                <Input
                  id="clothing-item"
                  value={clothingItem}
                  onChange={(e) => setClothingItem(e.target.value)}
                  placeholder="e.g., shirt"
                  className="mt-1"
                  list="clothing-categories"
                />
                <datalist id="clothing-categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label htmlFor="style">Desired Style (Optional, up to 3)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="style"
                    value={currentStyleInput}
                    onChange={(e) => setCurrentStyleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleStyleAdd();
                      }
                    }}
                    placeholder="e.g., casual"
                    className="flex-grow"
                    list="styles"
                  />
                  <Button type="button" onClick={handleStyleAdd} disabled={selectedStyles.length >= 3}>
                    Add Style
                  </Button>
                </div>
                <datalist id="styles">
                  {styles.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedStyles.map((s) => (
                    <Badge key={s} className="flex items-center gap-1 pr-1">
                      {s}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStyleRemove(s)}
                        className="h-auto p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || !clothingItem.trim()}
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Get Style Recommendations
                </div>
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        )}
        {recommendations && !isLoading && (
          <StyleRecommendations 
            clothingItem={clothingItem}
            color={color}
            recommendations={recommendations}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
