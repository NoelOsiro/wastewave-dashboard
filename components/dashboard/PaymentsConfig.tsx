
"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function PaymentConfig() {
    const [config, setConfig] = useState({
        provider: "M-Pesa",
        consumer_key: "",
        consumer_secret: "",
        short_code: "",
        passkey: "",
        initiator_name: "",
        security_credential: ""
    });

    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProviderChange = (value: string) => {
        setConfig((prev) => ({ ...prev, provider: value }));
    };

    const handleSave = async () => {
        setLoading(true);

        const { error } = await supabase
            .from("api_keys")
            .insert([config]);

        setLoading(false);

        if (error) {
            console.error("Error inserting data:", error);
            toast.error("Failed to save settings!");
        } else {
            toast.success("Payment settings saved!");
        }
    };

    return (
        <Card className="frosted-glass">
            <CardHeader>
                <CardTitle>Payment Config</CardTitle>
                <CardDescription>Set up your payment gateway and methods.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label>Payment Provider</Label>
                        <Select value={config.provider} onValueChange={handleProviderChange}>
                            <SelectTrigger className="glass-input">
                                <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent className="frosted-glass">
                                <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                                <SelectItem value="SasaPay">SasaPay</SelectItem>
                                <SelectItem value="Stripe">Stripe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="consumer_key">Consumer Key</Label>
                        <Input className="glass-input" name="consumer_key" value={config.consumer_key} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Consumer Secret</Label>
                        <Input className="glass-input" name="consumer_secret" value={config.consumer_secret} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Short Code</Label>
                        <Input className="glass-input" name="short_code" value={config.short_code} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Passkey</Label>
                        <Input className="glass-input" name="passkey" value={config.passkey} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Initiator Name</Label>
                        <Input className="glass-input" name="initiator_name" value={config.initiator_name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Security Credential</Label>
                        <Input className="glass-input" name="security_credential" value={config.security_credential} onChange={handleChange} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={loading} className="glass-button bg-primary hover:bg-primary/90">
                    {loading ? "Saving..." : "Save Config"}
                </Button>
            </CardFooter>
        </Card>
    );
}
